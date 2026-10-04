<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shop data (products, photos, prices, shipping) lives in src/data/products.ts; configurator options, palettes and text rules in src/data/custom.ts — so content can be edited without touching pages.
- Front-only mockup: cart is in-memory React context (src/lib/cart.tsx); no backend, payments or tracking — by explicit brief.
