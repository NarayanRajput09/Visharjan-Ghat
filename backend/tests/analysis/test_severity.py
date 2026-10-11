from analysis.severity import reading_severity


def test_severity_dissolved_oxygen():
    # DO minimum is 5.0
    assert reading_severity("Dissolved oxygen", "measured", 0.0) == 1.0
    assert reading_severity("Dissolved oxygen", "measured", 2.5) == 0.5
    assert reading_severity("Dissolved oxygen", "measured", 5.0) == 0.0
    assert reading_severity("Dissolved oxygen", "measured", 7.0) == 0.0

    # DO BDL/ND means oxygen too low to detect -> worst failure 1.0
    assert reading_severity("Dissolved oxygen", "bdl", None) == 1.0
    assert reading_severity("Dissolved oxygen", "nd", None) == 1.0

    # not sampled returns None
    assert reading_severity("Dissolved oxygen", "not_sampled", None) is None


def test_severity_bod():
    # BOD maximum is 3.0
    assert reading_severity("BOD", "measured", 3.0) == 0.0
    assert reading_severity("BOD", "measured", 1.5) == 0.0
    assert reading_severity("BOD", "measured", 12.0) == 1.0
    assert reading_severity("BOD", "measured", 25.0) == 1.0  # clamped to 1.0

    # BOD BDL means very low organic loading -> 0.0
    assert reading_severity("BOD", "bdl", None) == 0.0
    assert reading_severity("BOD", "not_sampled", None) is None


def test_severity_ph():
    # pH range is 6.5 to 8.5
    assert reading_severity("pH", "measured", 7.0) == 0.0
    assert reading_severity("pH", "measured", 6.5) == 0.0
    assert reading_severity("pH", "measured", 8.5) == 0.0
    assert reading_severity("pH", "measured", 9.25) == 0.5  # (9.25 - 8.5) / 1.5 = 0.5
    assert reading_severity("pH", "measured", 5.0) == 1.0   # (6.5 - 5.0) / 1.5 = 1.0
