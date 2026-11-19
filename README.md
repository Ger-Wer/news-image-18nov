# 18 November 2026 — World News in One Image

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Ger-Wer/news-image-18nov/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Ger-Wer/news-image-18nov/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

One 1024×1024 image summing up the world news of Wednesday 18 November 2026 —
a newspaper front page drawn procedurally with plain Node.js (standard library
only, hand-written PNG encoder, no network, no dependencies).

Contest: [news-image-20261118 on make.fun](https://make.fun/bounty/news-image-20261118)

## The five stories

1. **US strikes Iran** — the US hit an Iranian missile base on Qeshm Island in the
   Strait of Hormuz; Iran answered with drones at US bases in Kuwait (Ali Al Salem)
   and Bahrain (Sheikh Isa). Kuwait and Bahrain said they intercepted the drones.
2. **Xi meets Putin** — Xi Jinping and Vladimir Putin met in Shenzhen on the
   sidelines of the APEC summit, both speaking against protectionism and Western
   sanctions. A three-way meeting with Trump is set for Thursday 19 November.
3. **Peltola wins Alaska** — Democrat Mary Peltola beat Republican Dan Sullivan in
   the US Senate race in Alaska; Democrats take a 56–44 Senate majority.
4. **Ebola in Congo** — the outbreak passed 11,000 cases, the second-largest ever;
   children under 5 are hit hardest, and three in four patients die.
5. **Voyager 1** — the probe became the first human-made object to reach one
   light-day from Earth, about 16 billion miles (NASA, 05:16 ET).

## Files

- `entry.png` — the image (1024×1024, under 1 MiB)
- `gen.mjs` — the generator that draws it (run `node gen.mjs`)
- `main.ts` — the entry program: copies `entry.png` to `$MAKEFUN_OUTPUT_DIR/entry.png`

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Two runs produce byte-identical output (same sha256).

## License

MIT — see [LICENSE](LICENSE).
