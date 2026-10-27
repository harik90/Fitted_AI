    # FITTED AI

## Product Requirements Document + Full Implementation Specification

Build a production-quality AI photo-matching web application named **Fitted AI**.

The product goal is extremely simple:

> User uploads 2 photos → presses MATCH → AI automatically produces the best possible realistic result.

The application must NOT behave like Photoshop.

There must be **zero manual fitting**.

---

# 1. PRODUCT GOAL

Create an automatic AI system that takes:

### Input A

A user's face/photo.

### Input B

A target uniform/template/photo.

### Output

The user's identity naturally fitted into the target image while preserving the target's:

* uniform
* clothing
* logos
* badges
* tie
* collar
* buttons
* body
* background
* lighting where possible
* image composition

The AI should automatically determine:

* face location
* face angle
* head scale
* alignment
* facial landmarks
* head boundary
* hair boundary
* neck boundary
* skin tone
* lighting relationship
* blending area
* output quality

The user should never manually control these.

---

# 2. NON-GOALS

DO NOT implement:

* face position sliders
* scale sliders
* rotation sliders
* seekbars
* manual crop
* manual brush
* manual mask
* manual alignment
* timeline
* layer editor
* Photoshop-like editor
* complicated wizard
* multi-step editing interface
* template management dashboard
* unnecessary settings
* unnecessary AI controls

This is an **automatic matcher**, not an editor.

---

# 3. USER FLOW

The complete experience:

```text
Open app
   ↓
Upload Your Photo
   ↓
Upload Template / Uniform
   ↓
Choose optional background
   ↓
Press MATCH
   ↓
Automatic analysis
   ↓
Automatic generation
   ↓
Automatic quality check
   ↓
Automatic retry if required
   ↓
Best result
   ↓
Download
```

Maximum user interaction before generation:

**2 uploads + optional background + 1 button.**

---

# 4. UI DESIGN

Use a minimalist premium design.

## Colors

Light:

```text
Background     #F5F6F8
Surface        #FFFFFF
Primary        #151922
Secondary      #68707D
Border         #D9DDE3
Accent         #3155FF
Success        #22A06B
Error          #D64545
```

Dark:

```text
Background     #101318
Surface        #181C23
Primary        #F1F3F6
Secondary      #98A0AE
Border         #2A303A
Accent         #7182FF
```

Rules:

* no gradients
* no neon
* no glassmorphism
* no excessive shadows
* no decorative illustrations
* minimal borders
* generous whitespace
* professional typography

---

# 5. FRONTEND

Use:

* React
* TypeScript
* Tailwind CSS
* Vite or Next.js
* responsive layout
* accessible controls

Recommended component structure:

```text
src/
 ├── components/
 │   ├── Header
 │   ├── UploadCard
 │   ├── TemplatePicker
 │   ├── BackgroundPicker
 │   ├── MatchButton
 │   ├── ProcessingState
 │   ├── ResultPreview
 │   ├── BeforeAfter
 │   └── ErrorMessage
 │
 ├── pages/
 │   └── Home
 │
 ├── lib/
 │   ├── api
 │   ├── validation
 │   └── image
 │
 └── types/
```

---

# 6. MAIN SCREEN

## Header

Left:

**Fitted AI**

Right:

* EN / HI
* Dark mode
* Settings

Nothing else.

---

## Hero

Heading:

**Match your photo. Automatically.**

Subheading:

**Upload two photos. AI handles the rest.**

---

# 7. INPUT AREA

Desktop:

```text
┌──────────────────────┬──────────────────────┐
│     YOUR PHOTO       │      TEMPLATE        │
│                      │                      │
│      Upload          │       Upload         │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

Mobile:

Stack vertically.

---

## Your Photo card

Show:

**Your Photo**

Small description:

**Upload a clear face photo**

Accept:

* JPG
* JPEG
* PNG
* WEBP

Support:

* click
* drag/drop
* paste

After selection:

* preview
* replace
* remove

---

## Template card

Show:

**Template / Uniform**

Description:

**Upload the target image**

Below upload card provide compact default templates:

* Formal
* Doctor
* Pilot
* School
* Chef
* Business

Do not create a separate page.

---

# 8. BACKGROUND

Simple selector:

```text
Original
White
Light Grey
Blue
Navy
Custom
```

Use small circular controls.

Background replacement happens automatically after generation.

---

# 9. MATCH BUTTON

One major button:

**MATCH**

Disabled until both required images are available.

When clicked:

**MATCHING...**

Do not expose model names to the user.

---

# 10. PROCESSING UX

Show one clean processing state.

Possible status sequence:

```text
Analyzing photos
      ↓
Detecting face
      ↓
Automatic alignment
      ↓
Generating result
      ↓
Checking quality
```

Do not make these separate pages.

Use one animated progress indicator.

---

# 11. AI PIPELINE

Implement the AI backend as independent modules.

Architecture:

```text
Input Images
     ↓
Validation
     ↓
Face Detection
     ↓
Face Landmark Detection
     ↓
Identity Embedding
     ↓
Target Segmentation
     ↓
Automatic Alignment
     ↓
Face/Head Generation
     ↓
Restoration
     ↓
Pixel-Preserving Composite
     ↓
Quality Evaluation
     ↓
Retry if required
     ↓
Final Image
```

---

# 12. MODEL STACK

## A. Face analysis

Prototype:

**InsightFace**

Use it for:

* face detection
* landmarks
* face embedding
* identity similarity

IMPORTANT:

The InsightFace Python code is MIT, but the supplied pretrained model packages are currently non-commercial research-only. Use them only for the prototype/testing build. For any commercial release, make the model layer replaceable.

Create:

```text
FaceAnalyzer
```

interface so the model can later be replaced without changing the rest of the application.

---

# 13. SEGMENTATION

Use:

**SAM 2**

Purpose:

Automatically determine:

* head
* hair
* neck
* person boundary
* target editing region

SAM 2's official repository states that its model checkpoints and code are Apache 2.0.

Create:

```text
Segmenter
```

interface.

---

# 14. IDENTITY-PRESERVING GENERATION

Prototype:

**InstantID / compatible identity-preserving pipeline**

Use the user's face as identity reference.

Do not allow the generator to freely redesign the uniform.

The generation area must be restricted as much as technically possible.

IMPORTANT:

InstantID's code is Apache-licensed, but its released checkpoints and the InsightFace-based face models have research-use restrictions. Treat this as prototype-only unless separately licensed.

Create:

```text
IdentityGenerator
```

interface.

---

# 15. IMAGE EDITING / REFINEMENT

Support:

**Qwen-Image-Edit-2511**

Use it as an optional refinement/generation engine.

Its current Hugging Face model page lists Apache 2.0 licensing.

Do NOT automatically regenerate the entire target image.

Prefer masked editing.

---

# 16. FACE RESTORATION

Use:

**GFPGAN**

Only use restoration when needed.

Do not over-process the face.

Goal:

Natural texture.

Avoid:

* plastic skin
* over-sharpening
* artificial eyes
* waxy appearance

GFPGAN is Apache 2.0 except for listed third-party components, which must remain license-aware.

Create:

```text
FaceRestorer
```

interface.

---

# 17. PIXEL PRESERVATION

THIS IS CRITICAL.

The template should remain unchanged outside the generated region.

Pipeline:

```text
Original Template
       +
Generated Face Area
       ↓
Automatic Mask
       ↓
Feathered Composite
       ↓
Final Image
```

Do not reconstruct the whole uniform unnecessarily.

Preserve original pixels for:

* logos
* badges
* buttons
* tie
* collar
* clothing texture
* body
* background

Use:

* OpenCV
* Pillow
* alpha masks
* feathering
* color matching

---

# 18. AUTOMATIC ALIGNMENT

Never ask the user to align anything.

Calculate automatically:

```text
source face landmarks
target face landmarks
target pose
target head size
target eye line
target face angle
```

Generate the transformation automatically.

Potential methods:

* similarity transform
* affine transform
* perspective transform where required

Select automatically based on landmark geometry.

---

# 19. QUALITY CONTROL

Every generated image must pass an automatic quality check.

Implement:

### Identity check

Compare:

```text
source embedding
      vs
result embedding
```

Calculate similarity score.

---

### Face geometry check

Compare landmarks.

Check:

* eye position
* nose position
* mouth position
* face proportions

Reject obvious geometric failures.

---

### Sharpness check

Use:

```text
Laplacian variance
```

Reject heavily blurred results.

---

### Template preservation

Outside the generated mask compare:

```text
original template
      vs
final output
```

Use:

* SSIM
* PSNR
* pixel difference

The unaffected region should remain extremely close to the source template.

---

### Mask quality

Check:

* missing hair
* missing ears
* neck boundary
* visible hard edges
* halos

---

### Color consistency

Check:

* skin brightness
* color temperature
* exposure
* contrast

Automatically correct moderate mismatch.

---

# 20. AUTOMATIC RETRY

Do not immediately show a poor result.

Use:

```text
Generation
   ↓
Quality Check
   ↓
PASS → output
FAIL
   ↓
Retry with adjusted parameters
   ↓
Quality Check
   ↓
PASS → output
FAIL
   ↓
Third attempt
   ↓
Return best result
```

Maximum:

**3 attempts**

Keep the highest-scoring result.

---

# 21. QUALITY SCORE

Create:

```text
overall_score =
    identity_score * 0.40
  + geometry_score * 0.20
  + mask_score * 0.15
  + sharpness_score * 0.10
  + template_preservation_score * 0.15
```

Make weights configurable.

Store all scores internally.

Never show raw technical scores to normal users.

---

# 22. FALLBACK SYSTEM

Every AI module must have a fallback.

Example:

```text
Primary Generator
       ↓
Failure?
       ↓
Fallback Generator
       ↓
Failure?
       ↓
Return controlled error
```

Do not crash the application because one model fails.

---

# 23. HARDWARE SUPPORT

Detect automatically:

```text
CUDA
CPU
available VRAM
RAM
device
```

If CUDA exists:

Use GPU.

If no CUDA:

Allow preprocessing and UI locally.

For heavy generation, clearly report:

**“AI generation requires a compatible GPU.”**

Do not silently freeze the browser.

---

# 24. PERFORMANCE

Optimize aggressively.

Use:

* image resizing before inference
* cached model loading
* model warm-up
* reusable pipeline objects
* async API requests
* background processing
* temporary files
* memory cleanup
* GPU memory cleanup
* Web Workers where useful

Never reload the model for every request.

---

# 25. BACKEND

Use:

**Python + FastAPI**

Suggested structure:

```text
backend/
 ├── main.py
 ├── api/
 │   ├── match.py
 │   └── health.py
 │
 ├── pipelines/
 │   ├── matcher.py
 │   ├── alignment.py
 │   ├── segmentation.py
 │   ├── generation.py
 │   ├── restoration.py
 │   ├── compositing.py
 │   └── quality.py
 │
 ├── models/
 │   ├── face_analyzer.py
 │   ├── segmenter.py
 │   ├── identity_generator.py
 │   └── restorer.py
 │
 ├── utils/
 │   ├── image.py
 │   ├── metrics.py
 │   └── logging.py
 │
 └── config.py
```

---

# 26. API

Create:

```text
POST /api/match
```

Request:

```text
source_image
template_image
background_option
```

Response:

```json
{
  "success": true,
  "result_url": "...",
  "score": 0.91,
  "attempts": 2
}
```

Never expose internal model details.

---

# 27. INPUT VALIDATION

Before inference automatically check:

* valid image
* dimensions
* corrupted file
* exactly one clear face in source
* acceptable face size
* acceptable target image
* unsupported format
* excessive file size

Reject invalid inputs before expensive inference.

---

# 28. ERROR MESSAGES

Use human-friendly messages.

Examples:

```text
Face not clear enough. Try another photo.

Only one face should be visible.

The template could not be matched.

This image is too small.

Something went wrong while generating the result.
```

Never expose stack traces.

---

# 29. PRIVACY

Prototype mode:

* process locally where possible
* store files temporarily
* automatically delete temporary files
* do not keep face embeddings after request
* do not create permanent user profiles

Add a small note:

**“Your images are processed temporarily and removed after processing.”**

Only claim this when the implementation actually does it.

---

# 30. SAFETY / CONSENT

Add minimal Terms/notice:

**“Use only photos you own or have permission to edit.”**

Do not make the UI disturbing or intrusive.

---

# 31. RESULT SCREEN

Large image.

Controls:

```text
[ Before / After ]

[ DOWNLOAD ]   [ TRY AGAIN ]
```

Small status:

**AI MATCHED**

No editor.

---

# 32. DOWNLOAD

Download:

* PNG for maximum quality
* optional JPG

Preserve the best available output resolution.

Do not add watermark.

---

# 33. RESPONSIVE DESIGN

## Desktop

Two-column:

```text
Inputs            Preview
────────────      ─────────────
Your Photo        Final Result
Template
Background
MATCH
```

## Mobile

```text
Your Photo
Template
Templates
Background
Preview
MATCH
```

Sticky bottom action:

**MATCH**

After generation:

**DOWNLOAD**

---

# 34. DARK MODE

Implement full dark mode.

Same structure.

No separate dark layout.

---

# 35. LOCAL DEVELOPMENT

Create:

```text
.env.example
README.md
requirements.txt
package.json
```

Also create:

```text
scripts/
 ├── setup_windows.ps1
 ├── setup_linux.sh
 ├── download_models.py
 └── test_pipeline.py
```

---

# 36. MODEL CONFIGURATION

Never hard-code model paths.

Use:

```env
FACE_MODEL_PATH=
SEGMENTATION_MODEL_PATH=
GENERATION_MODEL_PATH=
RESTORATION_MODEL_PATH=
DEVICE=auto
MAX_RETRIES=3
QUALITY_THRESHOLD=0.80
```

---

# 37. INSTALLATION

Create a one-command development setup where practical.

Windows:

```powershell
.\scripts\setup_windows.ps1
```

Then:

```powershell
npm run dev
```

and:

```powershell
python -m uvicorn backend.main:app --reload
```

Provide exact model-download instructions separately.

Never download huge models silently without telling the developer.

---

# 38. TESTING

Create automated tests for:

### Unit tests

* image validation
* landmark transformation
* mask generation
* compositing
* quality scoring

### Integration tests

```text
upload → pipeline → result
```

### Failure tests

* no face
* multiple faces
* low resolution
* corrupt image
* generator failure
* segmentation failure
* insufficient VRAM

---

# 39. QUALITY TEST SET

Create a test directory:

```text
tests/assets/
```

Use cases:

```text
front_face
slight_left
slight_right
glasses
different_lighting
different_skin_tone
formal_uniform
school_uniform
doctor_uniform
pilot_uniform
low_quality
```

Do not ship copyrighted user images.

---

# 40. ACCEPTANCE CRITERIA

The project is considered complete only when:

### UI

* clean
* minimalist
* responsive
* no manual fitting
* no sliders
* no seekbars
* one-click matching

### AI

* automatically detects face
* automatically aligns
* automatically masks
* automatically generates
* automatically checks quality
* automatically retries

### Image preservation

The original template remains unchanged outside the edit region.

### Reliability

The API returns controlled errors instead of crashing.

### Performance

Models remain loaded between requests.

### Privacy

Temporary files are cleaned.

### Code

No giant monolithic file.

Use modular architecture.

---

# 41. DEVELOPMENT EXECUTION ORDER

DO NOT attempt to build everything at once.

Execute in this exact order.

## PHASE 1 — PROJECT FOUNDATION

Create:

* frontend
* backend
* API connection
* image upload
* responsive UI
* basic preview

Then run.

Do not move ahead until the app starts successfully.

---

## PHASE 2 — IMAGE PIPELINE

Implement:

* image validation
* face detection
* landmarks
* segmentation
* automatic alignment

Create a pipeline test.

Example:

```text
source.jpg
template.jpg
       ↓
analysis
       ↓
mask.png
       ↓
aligned.png
```

---

## PHASE 3 — GENERATION

Connect the prototype identity-preserving generator.

Implement:

```text
reference face
+
target template
+
automatic mask
=
generated result
```

Do not expose manual controls.

---

## PHASE 4 — COMPOSITING

Implement:

```text
generated region
+
untouched original template
=
final image
```

Test pixel preservation.

---

## PHASE 5 — QUALITY ENGINE

Implement:

* identity similarity
* landmark similarity
* mask check
* sharpness
* template preservation
* overall score

Then implement automatic retries.

---

## PHASE 6 — RESULT UI

Implement:

* processing animation
* result
* before/after
* download
* try again
* errors

---

## PHASE 7 — PERFORMANCE

Optimize:

* model loading
* GPU memory
* caching
* temporary files
* image resolution
* API concurrency

---

## PHASE 8 — FINAL POLISH

Fix:

* responsive layout
* dark mode
* loading states
* accessibility
* errors
* empty states
* keyboard support
* mobile spacing

---

# 42. ANTIGRAVITY AGENT RULES

You are the primary engineering agent.

Before modifying code:

1. Inspect the existing repository.
2. Detect the existing framework.
3. Reuse working code where possible.
4. Do not rewrite unrelated files.
5. Keep frontend and backend modular.
6. Document every major architectural decision.

After every major phase:

1. Run the application.
2. Run tests.
3. Check console errors.
4. Fix failures.
5. Continue only after the current phase works.

Do not merely generate code and stop.

Actually execute commands and verify the result.

---

# 43. IMPORTANT MODEL-LICENSING RULE

Keep every AI model behind an abstraction layer.

Example:

```python
class FaceAnalyzer:
    def analyze(self, image):
        ...

class IdentityGenerator:
    def generate(self, source, target, mask):
        ...

class Segmenter:
    def segment(self, image):
        ...
```

This allows research-only prototype models to be replaced with properly licensed models later without rebuilding the entire application.

---

# 44. FINAL EXPECTED EXPERIENCE

The user opens Fitted AI.

They see:

**Match your photo. Automatically.**

They upload:

```text
PHOTO 1
PHOTO 2
```

They press:

**MATCH**

The system automatically:

```text
Detect
→ Align
→ Segment
→ Generate
→ Restore
→ Composite
→ Verify
→ Retry if necessary
```

Then displays:

**Final Result**

with:

**DOWNLOAD**

No manual fitting at any stage.

---

# 45. FINAL INSTRUCTION TO ANTIGRAVITY

Do not treat this document as a design-only task.

Treat it as an **implementation specification**.

Build the application.

Create the folder structure.

Install dependencies.

Implement the frontend.

Implement the FastAPI backend.

Implement the AI pipeline interfaces.

Implement the first working prototype.

Run the application.

Run tests.

Fix errors.

Document setup.

At the end, provide:

1. What was implemented.
2. Which files were created/changed.
3. Which model checkpoints are required.
4. Exact setup commands.
5. Exact run commands.
6. Current limitations.
7. Next highest-value improvement.

Do not claim an AI model produces perfect results.

Optimize for the best measurable result with automatic validation and retries.
