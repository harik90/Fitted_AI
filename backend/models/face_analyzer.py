from abc import ABC, abstractmethod
from dataclasses import dataclass
import numpy as np
from numpy.typing import NDArray


@dataclass
class FaceData:
    bbox: tuple[int, int, int, int]
    landmarks: NDArray[np.float32]
    embedding: NDArray[np.float32]
    score: float


class BaseFaceAnalyzer(ABC):
    @abstractmethod
    def load(self) -> None: ...

    @abstractmethod
    def analyze(self, image: NDArray) -> FaceData | None: ...

    @abstractmethod
    def similarity(self, emb_a: NDArray, emb_b: NDArray) -> float: ...
