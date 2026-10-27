import unittest
import numpy as np
from pathlib import Path
from PIL import Image

from backend.utils.image import validate_image
from backend.pipelines.alignment import align_and_crop
from backend.pipelines.compositing import composite_pixel_preserving
from backend.pipelines.quality import evaluate_quality
from backend.pipelines.matcher import pipeline


class TestFittedAIPipeline(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path("backend/temp/test_run")
        self.test_dir.mkdir(parents=True, exist_ok=True)

        # Create synthetic test source (portrait face area)
        self.src_path = self.test_dir / "src.png"
        src_img = Image.new("RGB", (256, 256), color=(220, 180, 160))
        src_img.save(self.src_path)

        # Create synthetic test template (uniform)
        self.tgt_path = self.test_dir / "tgt.png"
        tgt_img = Image.new("RGB", (300, 400), color=(30, 45, 75))
        tgt_img.save(self.tgt_path)

    def test_image_validation_valid(self):
        err = validate_image(self.src_path)
        self.assertIsNone(err)

    def test_image_validation_too_small(self):
        tiny_path = self.test_dir / "tiny.png"
        Image.new("RGB", (32, 32)).save(tiny_path)
        err = validate_image(tiny_path)
        self.assertEqual(err, "This image is too small.")

    def test_alignment_and_mask(self):
        src_arr = np.array(Image.open(self.src_path))
        aligned, mask = align_and_crop(src_arr, (400, 300))
        self.assertEqual(aligned.shape, (400, 300, 3))
        self.assertEqual(mask.shape, (400, 300))
        # Mask should contain foreground pixels
        self.assertTrue(np.any(mask == 1))

    def test_pixel_preserving_compositing(self):
        tgt_arr = np.full((100, 100, 3), 50, dtype=np.uint8)
        gen_arr = np.full((100, 100, 3), 200, dtype=np.uint8)
        mask = np.zeros((100, 100), dtype=np.uint8)
        mask[30:70, 30:70] = 1

        composited = composite_pixel_preserving(tgt_arr, gen_arr, mask)
        self.assertEqual(composited.shape, tgt_arr.shape)

        # Pixel preservation check: outside the mask (e.g. top-left corner), pixels must strictly equal 50
        self.assertEqual(int(composited[5, 5, 0]), 50)
        self.assertEqual(int(composited[5, 5, 1]), 50)
        self.assertEqual(int(composited[5, 5, 2]), 50)

    def test_quality_scoring(self):
        src_arr = np.full((100, 100, 3), 100, dtype=np.uint8)
        tgt_arr = np.full((100, 100, 3), 50, dtype=np.uint8)
        out_arr = tgt_arr.copy()
        mask = np.zeros((100, 100), dtype=np.uint8)

        report = evaluate_quality(src_arr, tgt_arr, out_arr, mask)
        self.assertGreater(report.overall_score, 0.5)
        self.assertIsNotNone(report.passed)

    def test_full_pipeline_process(self):
        out_path = self.test_dir / "result.png"
        result = pipeline.process(self.src_path, self.tgt_path, out_path)
        self.assertTrue(result.success)
        self.assertTrue(out_path.exists())
        self.assertGreater(result.attempts, 0)
        self.assertGreater(result.quality_report.overall_score, 0.6)


if __name__ == "__main__":
    unittest.main()
