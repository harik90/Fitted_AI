from abc import ABC, abstractmethod
import numpy as np
from numpy.typing import NDArray


class BaseIdentityGenerator(ABC):
    @abstractmethod
    def load(self) -> None: ...

    @abstractmethod
    def generate(
        self,
        source: NDArray,
        target: NDArray,
        mask: NDArray,
        embedding: NDArray,
    ) -> NDArray: ...
