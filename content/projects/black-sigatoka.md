---
slug: "black-sigatoka"
title: "Black Sigatoka Early Stage Detection"
subtitle: "A computer vision system that goes beyond raw detection — pairing a trained YOLO model with a neuro-symbolic reasoning layer that interprets disease stage, severity, and consistency."
featured: true
order: 3
domain: "Computer Vision"
coverImage: "/blacksigatoka.png"
techStack:
  - "Python"
  - "Ultralytics YOLO (YOLO12n)"
  - "PyTorch"
  - "OpenCV"
  - "Pillow"
  - "FastAPI"
  - "PostgreSQL"
  - "MinIO"
  - "Docker"
  - "Jupyter"
---

## The Problem

Black Sigatoka is a progressive banana leaf disease with multiple stages, each calling for a
different response. A plain "diseased: yes/no" detector isn't enough — what's actually useful is
per-stage counts, severity interpretation, and a system that keeps improving from real-world
corrections instead of staying frozen at its first training run.

## What I Built

An end-to-end computer vision pipeline: a custom-prepared dataset with quality checks and
augmentation, a YOLO12n model transfer-learned across 7 disease stages, tiled inference for
high-resolution leaf images, an ontology-based symbolic reasoning layer that turns raw detections
into severity and consistency insights, and a feedback loop that captures corrections for future
retraining — served through FastAPI with PostgreSQL and MinIO-backed storage.

## Architecture

```
Raw banana leaf images
        │
        ▼
Quality checks (resolution, blur, brightness, file size)
        │
        ▼
4×4 tiling (256×256) + stratified train/val/test split
        │
        ▼
Offline augmentation (flip, crop/zoom, brightness, blur) + YOLO-format conversion
        │
        ▼
YOLO12n transfer learning (7-class: Healthy, Stage1–Stage6)
        │
        ▼
FastAPI model serving
        │
        ├── Image validation & preprocessing (OpenCV)
        ├── Tiled inference (256×256 tiles → merged back to original coordinates)
        ├── Per-stage counts & percentages
        └── Ontology-based neuro-symbolic reasoning
                │
                ▼
        Severity + consistency insights
        │
        ▼
JSON response ── image → MinIO, prediction metadata → PostgreSQL
        │
        ▼
User feedback (correct/incorrect + true label) → training_data queue for future retraining
```

## Key Technical Decisions

- **A neuro-symbolic reasoning layer on top of YOLO, not just raw detection output.** YOLO provides
  class, confidence, and bounding boxes; a separate ontology (ordered disease stages, lesion types,
  severity mapping, progression rules) turns those raw detections into an aggregated severity read,
  a worst-stage call, and consistency flags — an interpretive layer a bare detection model can't
  give you by itself.
- **Tiled inference for high-resolution leaf images.** Large images are split into overlapping
  256×256 tiles before inference, then bounding boxes are mapped back into original-image
  coordinates and merged — keeping the model focused on lesion-scale detail instead of losing
  resolution to downsampling.
- **A feedback-to-retraining loop from day one.** Every prediction gets an ID; user corrections are
  captured, matched back to the source image, and queued for retraining — laying the foundation for
  a model that keeps improving rather than staying static after one training run.
- **Deliberately withholding treatment recommendations.** The reasoning layer currently returns
  severity and consistency insights but intentionally leaves treatment suggestions empty — a
  scoping choice to avoid giving agronomic advice before that layer is properly validated.

## Engineering Lessons

- **Matching the claim to the metric.** The model reached a strong recorded validation mAP50 of
  97.6% (precision 92.9%, recall 95.3%) under the training setup used — framed precisely as a
  validation-set mAP result, not as a general "accuracy" figure, since the two measure genuinely
  different things and conflating them overstates what's actually been shown.
- **Tiling before splitting can leak information across sets.** Because tiles were generated from
  each source image before the train/validation/test split, tiles from the same original photo
  could end up across multiple splits — a leakage risk worth addressing with a source-grouped split
  in the next dataset iteration, since it can quietly inflate validation numbers.
- **Full-image boxes behave more like classification than detection.** The verified data-prep path
  produced bounding boxes covering entire images rather than individual lesions — technically valid
  YOLO input, but worth being precise about when describing what the model actually localizes
  versus classifies.

## Results

- Custom 7-class detection model (Healthy + 6 disease stages) via YOLO12n transfer learning
- 97.6% recorded validation mAP50 (per-class AP50 ranging 0.95–0.995 across all 7 classes)
- Full serving stack: FastAPI inference, PostgreSQL for predictions/feedback, MinIO for image
  storage
- Built-in feedback loop capturing real corrections for future retraining
- Dockerized API and infrastructure services
