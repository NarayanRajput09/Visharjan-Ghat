import pytest
from analysis.status import normalise_status, UnknownStatusError


def test_status_measured():
    stat, val = normalise_status(value="2.5", flag="", value_as_printed="2.5")
    assert stat == "measured"
    assert val == 2.5


def test_status_bdl():
    stat, val = normalise_status(value=None, flag="BDL", value_as_printed="BDL")
    assert stat == "bdl"
    assert val is None


def test_status_nd():
    stat, val = normalise_status(value=None, flag="", value_as_printed="ND")
    assert stat == "nd"
    assert val is None


def test_status_not_sampled():
    stat, val = normalise_status(value=None, flag="not sampled", value_as_printed="")
    assert stat == "not_sampled"
    assert val is None

    stat2, val2 = normalise_status(value=None, flag="*", value_as_printed="*")
    assert stat2 == "not_sampled"
    assert val2 is None

    stat3, val3 = normalise_status(value=None, flag="**", value_as_printed="**")
    assert stat3 == "not_sampled"
    assert val3 is None


def test_status_unknown_error():
    with pytest.raises(UnknownStatusError):
        normalise_status(value=None, flag=None, value_as_printed="unrecognized_flag")
