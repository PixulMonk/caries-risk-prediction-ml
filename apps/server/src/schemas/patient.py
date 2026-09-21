from typing import Literal
from pydantic import BaseModel, Field

CivilStatus = Literal["Single", "Married", "Widowed", "Separated"]
Occupation = Literal[
    "Student", "Blue Collar", "White Collar", "Professional", "Unemployed", "Retired"
]
TypeOfSugar = Literal["Sugary Drinks", "Sweets", "Both", "None"]


class DMFTData(BaseModel):
    """Clinical documentation only — deliberately NOT fed to the model.
    Excluded during training as a leaky feature (notebook cell 9)."""

    d: int = Field(ge=0, le=32, description="Decayed")
    m: int = Field(ge=0, le=32, description="Missing")
    f: int = Field(ge=0, le=32, description="Filled")

    @property
    def total(self) -> int:
        return self.d + self.m + self.f