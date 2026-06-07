'use client';

import type { Prediction } from '../types';
import { ProbBar } from '../ui/ProbBar';
import { StageCard } from '../ui/StageCard';

// Stage 3 — the model ranks the next token. Real softmaxed logits.

export function PredictStage({ predictions }: { predictions: Prediction[] }) {
  return (
    <StageCard
      no={3}
      title="ทำนายคำต่อไป"
      desc="โมเดลจัดอันดับว่าคำถัดไปน่าจะเป็นอะไร นี่คือสิ่งที่มันทำจริง ๆ"
    >
      <div className="mt-[10px]">
        {predictions.map((p) => (
          <ProbBar key={p.id} token={p.token} prob={p.prob} />
        ))}
      </div>
    </StageCard>
  );
}
