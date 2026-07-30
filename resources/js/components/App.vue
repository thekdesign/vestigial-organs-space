<template>
    <div class="museum">
        <!-- 展廳門楣 -->
        <!-- 門楣加 canvasui 流體背景：滑過標題會有 brass 色流動痕跡（低 blend，標題仍清楚）。 -->
        <Liquid class="masthead-fluid" :intensity="1.6" :blend="0.4" :color="[0.8, 0.63, 0.31]" :radius="0.18">
            <header class="masthead">
                <p class="masthead__kicker">Cabinet of Curiosities · est. {{ estYear }}</p>
                <h1 class="masthead__title">退化器官博物館</h1>
                <p class="masthead__latin">Vestigial Organs Space</p>
                <p class="masthead__manifesto">
                    痕跡器官，是演化留下、卻不再承擔原本功能的構造。<br />
                    這裡陳列我做過的個人小專案 —— 每一個都源自某次衝動而長出，
                    有的還在跳動，有的早已浸入福馬林。歡迎隔著玻璃參觀。
                </p>
            </header>
        </Liquid>

        <!-- 科別篩選 -->
        <nav class="filters" aria-label="依科別篩選">
            <button
                class="filters__btn"
                :class="{'is-active': active === 'all'}"
                @click="active = 'all'"
            >
                全部館藏
            </button>
            <button
                v-for="(fam, key) in families"
                :key="key"
                class="filters__btn"
                :class="{'is-active': active === key}"
                :style="{'--fam': fam.color}"
                @click="active = key"
            >
                <span class="filters__dot"></span>
                {{ fam.label }}
                <em>{{ fam.latin }}</em>
            </button>
        </nav>

        <!-- 標本陳列櫃：依科別分層 -->
        <main class="cabinet">
            <section
                v-for="shelf in shelves"
                :key="shelf.key"
                class="shelf"
                :style="{'--fam': shelf.family.color}"
            >
                <!-- 黃銅銘牌 -->
                <div class="shelf__plate">
                    <span class="shelf__plate-screw"></span>
                    <span class="shelf__plate-screw"></span>
                    <h2 class="shelf__fam">{{ shelf.family.label }}</h2>
                    <p class="shelf__latin">{{ shelf.family.latin }}</p>
                    <p class="shelf__note">{{ shelf.family.note }}</p>
                </div>

                <!-- 站在層板上的標本 -->
                <div class="shelf__deck">
                    <SpecimenCard
                        v-for="s in shelf.items"
                        :key="s.slug"
                        :specimen="s"
                        :family="shelf.family"
                    />
                </div>

                <!-- 木質層板 -->
                <div class="shelf__board" aria-hidden="true"></div>
            </section>
        </main>

        <footer class="colophon">
            <p>標本採集自 GitHub <a href="https://github.com/thekdesign" target="_blank" rel="noopener noreferrer">@thekdesign</a></p>
            <p class="colophon__fine">標本若有失準、冒犯或想申訴者，請寄至本館投訴信箱 <a href="mailto:thek8014@proton.me">thek8014@proton.me</a></p>
        </footer>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {specimens, families} from 'data/specimens';
import SpecimenCard from 'components/common/SpecimenCard.vue';
import Liquid from 'components/canvasui/Liquid.vue';

const active = ref('all');

// 依科別分層；篩選時只留選中的那一層。空層不顯示。
const shelves = computed(() => {
    const keys = active.value === 'all' ? Object.keys(families) : [active.value];
    return keys
        .map((key) => ({
            key,
            family: families[key],
            // 同層內新的排最左（依採集年月，同月則編號大的較新）
            items: specimens
                .filter((s) => s.family === key)
                .sort((a, b) => b.collected.localeCompare(a.collected) || b.no - a.no),
        }))
        .filter((shelf) => shelf.items.length);
});

const estYear = computed(() =>
    specimens.reduce((min, s) => {
        const y = s.collected.slice(0, 4);
        return y < min ? y : min;
    }, '9999'));
</script>

<style lang="scss" scoped>
.museum {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px 80px;
}

/* === 門楣 === */
.masthead {
    text-align: center;
    padding: 72px 0 40px;
    border-bottom: 1px solid rgba(203, 161, 78, 0.15);
}

.masthead__kicker {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--color-brass-400);
    margin-bottom: 18px;
}

.masthead__title {
    font-family: var(--font-serif);
    font-size: clamp(34px, 7vw, 60px);
    font-weight: 900;
    letter-spacing: 0.04em;
    color: var(--color-paper-100);
    text-shadow: 0 2px 30px rgba(203, 161, 78, 0.25);
}

.masthead__latin {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(15px, 2.4vw, 21px);
    letter-spacing: 0.12em;
    color: var(--color-brass-300);
    margin-top: 6px;
}

.masthead__manifesto {
    max-width: 560px;
    margin: 26px auto 0;
    font-size: 14.5px;
    line-height: 2;
    color: rgba(232, 217, 184, 0.72);
}

/* === 篩選 === */
.filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 34px 0 30px;
}

.filters__btn {
    --fam: var(--color-brass-400);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border: 1px solid rgba(203, 161, 78, 0.25);
    border-radius: 999px;
    font-size: 13px;
    color: rgba(232, 217, 184, 0.75);
    background: rgba(26, 20, 16, 0.6);
    transition: all 0.25s ease;

    em {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: 11px;
        opacity: 0.6;
    }

    &:hover {
        border-color: color-mix(in srgb, var(--fam) 60%, transparent);
        color: var(--color-paper-100);
    }

    &.is-active {
        background: color-mix(in srgb, var(--fam) 22%, var(--color-ink-800));
        border-color: var(--fam);
        color: var(--color-paper-100);
    }
}

.filters__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fam);
    box-shadow: 0 0 8px var(--fam);
}

/* === 陳列櫃 === */
.cabinet {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px 22px 0;
    /* 兩側木質立柱 */
    border-left: 10px solid var(--color-ink-700);
    border-right: 10px solid var(--color-ink-700);
    background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.35), transparent 6%, transparent 94%, rgba(0, 0, 0, 0.35)),
        repeating-linear-gradient(90deg, transparent 0 14px, rgba(0, 0, 0, 0.04) 14px 15px);
    box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.4);
}

.shelf {
    position: relative;
    padding-bottom: 18px;
}

/* 黃銅銘牌 */
.shelf__plate {
    position: relative;
    display: inline-block;
    margin-bottom: 18px;
    padding: 10px 22px;
    border-radius: 4px;
    background: linear-gradient(160deg, var(--color-brass-300), var(--color-brass-500) 60%, var(--color-brass-600));
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.shelf__plate-screw {
    position: absolute;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff6dc, var(--color-brass-600));
    transform: translateY(-50%);

    &:nth-child(1) { left: 7px; }
    &:nth-child(2) { right: 7px; }
}

.shelf__fam {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: var(--color-ink-900);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    padding: 0 6px;
}

.shelf__latin {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: rgba(20, 14, 6, 0.7);
    padding: 0 6px;
}

.shelf__note {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(232, 217, 184, 0.5);
}

.shelf__deck {
    display: flex;
    gap: 26px;
    /* 橫向滑動：沿著層板往右檢視更多標本 */
    overflow-x: auto;
    padding: 10px 4px 14px;
    scroll-snap-type: x proximity;
    /* 標本投在層板上的接觸陰影 */
    filter: drop-shadow(0 14px 10px rgba(0, 0, 0, 0.45));

    /* 每件標本固定寬度，不壓縮 */
    & > * {
        flex: 0 0 300px;
        scroll-snap-align: start;
    }

    /* 黃銅細捲軸 */
    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 999px;
    }

    &::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--fam) 50%, var(--color-brass-500));
        border-radius: 999px;
    }

    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--fam) 50%, var(--color-brass-500)) rgba(0, 0, 0, 0.3);
}

/* 木質層板 */
.shelf__board {
    position: relative;
    height: 18px;
    margin: 6px -22px 0;
    border-radius: 2px;
    background:
        linear-gradient(180deg, var(--color-ink-600), var(--color-ink-700) 45%, var(--color-ink-800));
    box-shadow:
        inset 0 2px 3px rgba(255, 255, 255, 0.05),
        0 16px 22px -10px rgba(0, 0, 0, 0.75);

    /* 前緣黃銅壓條 */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--fam) 50%, var(--color-brass-500)), var(--color-brass-600));
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    /* 木紋 */
    &::after {
        content: '';
        position: absolute;
        inset: 0 0 4px;
        background: repeating-linear-gradient(90deg, transparent 0 26px, rgba(0, 0, 0, 0.12) 26px 27px);
        opacity: 0.5;
    }
}

/* === 版權 === */
.colophon {
    text-align: center;
    margin-top: 64px;
    padding-top: 28px;
    border-top: 1px solid rgba(203, 161, 78, 0.15);
    font-size: 13px;
    color: rgba(232, 217, 184, 0.55);

    a {
        color: var(--color-brass-300);
        border-bottom: 1px solid currentColor;
    }

    &__fine {
        margin-top: 8px;
        font-family: var(--font-mono);
        font-size: 11px;
        color: rgba(232, 217, 184, 0.35);
    }
}
</style>
