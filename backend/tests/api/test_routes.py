import pytest
from fastapi.testclient import TestClient
from app.main import create_app


@pytest.fixture(scope="module")
def client():
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "data_hash" in data
    assert data["scoring_config_version"] == "1.0"
    assert "llm_available" in data


def test_ranking_endpoint(client: TestClient):
    response = client.get("/api/ranking")
    assert response.status_code == 200
    data = response.json()
    assert len(data["ghats"]) == 7
    ranks = [g["rank"] for g in data["ghats"]]
    assert ranks == [1, 2, 3, 4, 5, 6, 7]


def test_ranking_invalid_class(client: TestClient):
    response = client.get("/api/ranking?cpcb_class=Z")
    assert response.status_code == 422


def test_ghat_detail_valid(client: TestClient):
    response = client.get("/api/ghats/bairagarh-sant-hirdaram-kund")
    assert response.status_code == 200
    data = response.json()
    assert data["ghat"]["slug"] == "bairagarh-sant-hirdaram-kund"
    assert "gap_no_durga_2025" in data["known_gaps"]
    assert len(data["coverage"]) == 18  # 3 years x 2 festivals x 3 phases


def test_ghat_detail_not_found(client: TestClient):
    response = client.get("/api/ghats/nope")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "NOT_FOUND"


def test_ghat_readings_not_sampled_null_value(client: TestClient):
    response = client.get("/api/ghats/bairagarh-sant-hirdaram-kund/readings?status=not_sampled")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    for item in items:
        assert item["status"] == "not_sampled"
        assert item["value"] is None


def test_brief_endpoint_and_cache(client: TestClient):
    # First call
    res1 = client.post("/api/briefs", json={"cpcb_class": "B"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["source"] == "template"
    assert data1["validation"]["ok"] is True
    brief_id = data1["brief_id"]

    # Second call (cache hit)
    res2 = client.post("/api/briefs", json={"cpcb_class": "B"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["brief_id"] == brief_id


def test_export_ranking_csv(client: TestClient):
    response = client.get("/api/export/ranking.csv?cpcb_class=B")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    lines = response.text.strip().split("\r\n")
    if len(lines) == 1:
        lines = response.text.strip().split("\n")
    assert len(lines) == 8  # header + 7 ghats
    assert lines[0].startswith("rank,ghat,score,tier,confidence")
