# Tündérkert kabalafigura — image generation prompt

A jelenleg használt fájl (`tunderkert-fairy.png` / `.webp`) már legenerálva és feldolgozva
(háttér eltávolítva, átlátszó PNG/WebP). Ez a prompt akkor kellhet, ha új variánst,
más pózt vagy évszakos verziót szeretnél generálni ugyanabban a stílusban.

## Prompt (angol, illusztráció-generátorokhoz)

> A cute, gentle watercolor-style fairy character for a family nursery brand,
> completely original design (NOT Tinker Bell / Disney fairy — different hairstyle,
> different dress, different pose, different wing shape). Light chestnut / honey-blonde
> wavy hair in a messy bun with a small flower crown. Warm, friendly round face with
> big soft eyes and a gentle smile. Dress made of layered leaf and flower petal shapes
> in soft mint-green and powder-pink watercolor tones. Translucent wings shaped like
> leaves or flower petals, soft green-to-pink gradient, delicate vein details.
> Barefoot, mid-dance pose, arms gently open. Surrounded by tiny gold "fairy dust"
> sparkle particles, small daisies, hearts and soft botanical line elements.
> Soft pastel watercolor illustration style, storybook quality, white/cream background
> for easy background removal, no text, no logos, no other characters.

## Stílusjegyzők, amiket meg kell tartani az egységesség miatt
- pasztell akvarell technika (nem cell-shaded, nem 3D render)
- zsálya­zöld + mentazöld + púderrózsaszín + arany paletta
- levél/virágszirom motívumú ruha és szárny — SOHA nem zöld harang-szoknya vagy klasszikus tündér ruha
- meleg, barátságos, nem "hercegnős" arckifejezés
- fehér/krém háttér, hogy utólag könnyen eltávolítható legyen (lásd `process_images.py` a projektben)

## Felhasználási helyek a weboldalon
- Hero szekció (teljes alak)
- Rólunk / Galéria (kisebb, halványított motívumként)
- Erős CTA szekció (lebegő, félig levágott alak)
- Footer (csak a `wing-mark` SVG sziluett, lásd `assets/decor/sprite.svg`)
