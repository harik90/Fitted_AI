from abc import ABC, abstractmethod
from dataclasses import dataclass
import numpy as np
from numpy.typing import NDArray


@dataclass
class SegmentationResult:
    mask: NDArray[np.uint8]
    head_mask: NDArray[np.uint8] | None = None
    hair_mask: NDArray[np.uint8] | None = None


class BaseSegmenter(ABC):
    @abstractmethod
    def load(self) -> None: ...

    @abstractmethod
    def segment(self, image: NDArray, point: tuple[int, int] | None = None) -> SegmentationResult: ...
