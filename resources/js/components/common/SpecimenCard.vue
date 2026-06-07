<template>
    <a
        class="specimen"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${specimen.name} — ${specimen.live ? '前往展示' : '調閱原始碼'}`"
        :style="{'--fam': family.color}"
    >
        <!-- 浸液標本瓶 -->
        <div class="jar">
            <div class="jar__lid"></div>
            <div class="jar__neck"></div>
            <div class="jar__body">
                <div class="jar__liquid">
                    <!-- 漂浮的器官標本 -->
                    <svg class="organ" viewBox="0 0 120 120" aria-hidden="true">
                        <defs>
                            <radialGradient :id="`og-${specimen.slug}`" cx="38%" cy="32%" r="75%">
                                <stop offset="0%" stop-color="var(--fam)" stop-opacity="0.95" />
                                <stop offset="65%" stop-color="var(--fam)" stop-opacity="0.7" />
                                <stop offset="100%" stop-color="#0b0907" stop-opacity="0.85" />
                            </radialGradient>
                        </defs>
                        <path :d="blob" :fill="`url(#og-${specimen.slug})`" />
                        <path :d="vein" class="organ__vein" />
                    </svg>

                    <!-- 氣泡 -->
                    <span v-for="b in bubbles" :key="b.id" class="bubble" :style="b.style"></span>
                </div>
                <div class="jar__glass"></div>
                <span class="jar__no">No.{{ pad(specimen.no) }}</span>
            </div>
        </div>

        <!-- 做舊標本標籤 -->
        <div class="label">
            <div class="label__head">
                <span class="label__fam" :title="family.note">{{ family.label }} · {{ family.latin }}</span>
                <span class="label__status" :class="`is-${specimen.status}`">
                    ● {{ statusMeta[specimen.status].label }}
                </span>
            </div>

            <h2 class="label__name">{{ specimen.name }}</h2>
            <p class="label__latin">{{ specimen.latin }}</p>

            <p class="label__desc">{{ specimen.desc }}</p>

            <ul class="label__features">
                <li v-for="f in specimen.features" :key="f">{{ f }}</li>
            </ul>

            <div class="label__foot">
                <span class="label__collected">採集 {{ specimen.collected }}</span>
                <span class="label__link">
                    {{ specimen.live ? '前往展示' : '調閱原始碼' }} →
                </span>
            </div>
        </div>
    </a>
</template>

<script setup>
import {computed} from 'vue';
import {statusMeta, resolveLink} from 'data/specimens';

const props = defineProps({
    specimen: {type: Object, required: true},
    family: {type: Object, required: true},
});

const link = computed(() => resolveLink(props.specimen));

const pad = (n) => String(n).padStart(3, '0');

// 5 種器官輪廓 + 對應血管路徑，依編號決定，讓每件標本長得不同。
const BLOBS = [
    'M60 14c22 0 40 16 40 38 0 26-18 54-40 54S20 78 20 52C20 30 38 14 60 14Z',
    'M58 12c26-2 46 18 44 42-2 22-10 30-8 44 1 8-10 14-22 12-22-4-50-22-50-52 0-28 14-44 36-46Z',
    'M62 16c20-4 38 10 40 30 2 22-16 28-14 48 1 10-12 16-26 12-26-6-44-26-44-52 0-22 18-34 44-38Z',
    'M60 14c24 0 38 18 38 40 0 18-12 26-12 40 0 10-12 16-26 16-22 0-40-22-40-50 0-26 18-46 40-46Z',
    'M56 12c28 0 46 20 44 46-2 24-22 28-22 48 0 6-10 10-20 8C36 110 18 84 18 56 18 30 32 12 56 12Z',
];
const VEINS = [
    'M60 30c-6 16 8 24 2 40-3 8-1 18 4 26',
    'M58 28c8 14-6 24 0 42 2 8 8 14 14 20',
    'M62 32c-8 12 6 22-2 38-4 9-2 18 2 24',
    'M60 30c10 12-4 22 2 40 3 9 0 18-6 24',
    'M56 28c-4 16 10 22 4 40-3 9 0 18 6 24',
];
const idx = computed(() => (props.specimen.no - 1) % BLOBS.length);
const blob = computed(() => BLOBS[idx.value]);
const vein = computed(() => VEINS[idx.value]);

// 每瓶 4 顆氣泡，位置/延遲依編號決定（無隨機，build 穩定）。
const bubbles = computed(() => Array.from({length: 4}, (_, i) => {
    const seed = props.specimen.no * 7 + i * 13;
    const left = 18 + ((seed * 9) % 64);
    const size = 3 + ((seed * 3) % 5);
    const delay = ((seed * 5) % 40) / 10;
    const dur = 5 + ((seed * 7) % 40) / 10;
    return {
        id: i,
        style: {
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
        },
    };
}));
</script>

<style lang="scss" scoped>
.specimen {
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--color-ink-800), var(--color-ink-900));
    border: 1px solid rgba(203, 161, 78, 0.18);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(227, 193, 121, 0.06);
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;

    &:hover {
        transform: translateY(-6px);
        border-color: color-mix(in srgb, var(--fam) 55%, transparent);
        box-shadow: 0 30px 60px -26px rgba(0, 0, 0, 0.95),
            0 0 40px -18px color-mix(in srgb, var(--fam) 70%, transparent);

        .organ { animation-duration: 4s; }
        .jar__glass::before { opacity: 0.9; }
    }
}

/* === 標本瓶 === */
.jar {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0 0;
    background:
        radial-gradient(120% 70% at 50% 0%, rgba(203, 161, 78, 0.12), transparent 60%),
        var(--color-ink-950);
}

.jar__lid {
    width: 78px;
    height: 12px;
    border-radius: 5px 5px 3px 3px;
    background: linear-gradient(180deg, var(--color-brass-300), var(--color-brass-500));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.jar__neck {
    width: 60px;
    height: 9px;
    background: linear-gradient(180deg, var(--color-brass-500), var(--color-brass-600));
    border-radius: 0 0 3px 3px;
}

.jar__body {
    position: relative;
    width: 100%;
    height: 188px;
    padding: 0 22px 18px;
}

.jar__liquid {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px 4px 8px 8px;
    background:
        linear-gradient(180deg,
            color-mix(in srgb, var(--color-formalin-400) 22%, transparent),
            color-mix(in srgb, var(--color-formalin-600) 40%, var(--color-ink-900)));
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.55);
}

.jar__glass {
    position: absolute;
    inset: 0 22px 18px;
    border-radius: 4px 4px 8px 8px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(115deg, rgba(255, 255, 255, 0.16) 0%, transparent 22%, transparent 78%, rgba(255, 255, 255, 0.07) 100%);

    &::before {
        content: '';
        position: absolute;
        top: 8%;
        left: 14%;
        width: 14%;
        height: 70%;
        border-radius: 50%;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
        filter: blur(2px);
        opacity: 0.6;
        transition: opacity 0.35s ease;
    }
}

.jar__no {
    position: absolute;
    bottom: 26px;
    right: 30px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: rgba(244, 234, 210, 0.5);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
}

.organ {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 92px;
    height: 92px;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5));
    transform-origin: center;
    animation: float 7s ease-in-out infinite;
}

.organ__vein {
    fill: none;
    stroke: rgba(11, 9, 7, 0.45);
    stroke-width: 2.5;
    stroke-linecap: round;
}

@keyframes float {
    0%, 100% { transform: translate(-50%, -52%) rotate(-4deg); }
    50% { transform: translate(-50%, -48%) rotate(4deg); }
}

.bubble {
    position: absolute;
    bottom: -8px;
    border-radius: 50%;
    background: rgba(244, 234, 210, 0.5);
    animation-name: rise;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in;
}

@keyframes rise {
    0% { transform: translateY(0); opacity: 0; }
    15% { opacity: 0.7; }
    100% { transform: translateY(-180px); opacity: 0; }
}

/* === 標籤 === */
.label {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 18px 18px;
    background:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(140, 109, 59, 0.05) 23px 24px),
        linear-gradient(180deg, var(--color-paper-100), var(--color-paper-200));
    color: var(--color-ink-800);
    border-top: 1px dashed rgba(126, 93, 31, 0.4);
}

.label__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.label__fam {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    color: color-mix(in srgb, var(--fam) 60%, var(--color-ink-800));
    border: 1px solid color-mix(in srgb, var(--fam) 45%, transparent);
    padding: 2px 7px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--fam) 10%, transparent);
}

.label__status {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10.5px;
    font-weight: 500;
    white-space: nowrap;

    &.is-living { color: var(--color-formalin-500); }
    &.is-preserved { color: var(--color-brass-600); }
}

.label__name {
    font-family: var(--font-serif);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-ink-900);
}

.label__latin {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 12.5px;
    color: rgba(90, 66, 30, 0.85);
    margin-top: -4px;
}

.label__desc {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(42, 31, 22, 0.86);
}

.label__features {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;

    li {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        line-height: 1.4;
        padding: 2px 8px 2px 6px;
        border-radius: 3px;
        background: color-mix(in srgb, var(--fam) 12%, transparent);
        border: 1px solid color-mix(in srgb, var(--fam) 22%, transparent);
        color: rgba(60, 44, 24, 0.92);

        &::before {
            content: '✦';
            font-size: 8px;
            color: color-mix(in srgb, var(--fam) 70%, var(--color-ink-800));
        }
    }
}

.label__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid rgba(126, 93, 31, 0.25);
}

.label__collected {
    font-family: var(--font-mono);
    font-size: 11px;
    color: rgba(90, 66, 30, 0.7);
}

.label__link {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--color-ink-900);
    border-bottom: 1px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
}

.specimen:hover .label__link {
    color: color-mix(in srgb, var(--fam) 70%, var(--color-ink-900));
    border-color: currentColor;
}
</style>
