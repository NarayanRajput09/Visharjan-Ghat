from analysis.loader import load_all


def test_golden_data_properties():
    df, models, limits, data_hash = load_all("data/raw")

    # 1. Row count: 1,524
    assert len(df) == 1524
    assert len(models) == 1524

    # 2. Distinct sites: 7
    assert df["site_slug"].nunique() == 7

    # 3. DO readings: 116 measured, 42 < 5
    do = df[(df["parameter"] == "Dissolved oxygen") & (df["status"] == "measured")]
    assert len(do) == 116
    assert (do["value_numeric"] < 5.0).sum() == 42

    # 4. BOD readings: 112 measured, 100 > 3
    bod = df[(df["parameter"] == "BOD") & (df["status"] == "measured")]
    assert len(bod) == 112
    assert (bod["value_numeric"] > 3.0).sum() == 100

    # 5. 4 zero-DO readings at Bairagarh (2023 & 2025)
    bairagarh_zero_do = df[
        (df["site_slug"] == "bairagarh-sant-hirdaram-kund")
        & (df["parameter"] == "Dissolved oxygen")
        & (df["value_numeric"] == 0.0)
    ]
    assert len(bairagarh_zero_do) == 4

    # 6. No Durga 2025 table for Bairagarh or Malikhedi
    bairagarh_durga_2025 = df[
        (df["site_slug"] == "bairagarh-sant-hirdaram-kund")
        & (df["year_int"] == 2025)
        & (df["festival"] == "Durga")
        & (df["status"] != "not_sampled")
    ]
    assert len(bairagarh_durga_2025) == 0

    malikhedi_durga_2025 = df[
        (df["site_slug"] == "malikhedi-kund")
        & (df["year_int"] == 2025)
        & (df["festival"] == "Durga")
        & (df["status"] != "not_sampled")
    ]
    assert len(malikhedi_durga_2025) == 0
