# Advanced learning expansion checklist

- [x] Add beginner-friendly tense maps, timelines, formulas, signal words, contrasts, common mistakes, and guided examples.
- [x] Add tense practice prompts that connect form, meaning, and real-life context.
- [x] Expand Quick Quiz with thousands of advanced vocabulary questions and efficient selection.
- [x] Preserve search, categories, audio, review mistakes, and local progress.
- [x] Build, checkpoint, publish, and verify the GitHub Pages update.

## Performance optimization

- [x] Measure current production bundle sizes and identify eager imports.
- [x] Identify large vocabulary, tense quiz, and shadowing datasets loaded on first paint.
- [x] Move non-home study data behind lazy loading or fetch-on-demand boundaries.
- [x] Add a lightweight loading state for deferred study modes.
- [x] Validate TypeScript, production build, first-load bundle, and core study modes.
- [x] Save a checkpoint and publish the optimized version.

## Smoother clean UI refinement

- [x] Stabilize and type-check the deferred loading implementation.
- [x] Improve spacing, hierarchy, button states, and loading feedback without changing the Editorial Study Hall direction.
- [x] Add smoother responsive behavior and reduced-motion-safe transitions.
- [x] Verify the key study modes on desktop and mobile.
- [x] Save and publish the polished version.

## Complete learning system

- [x] Define shared local learning state for daily plan, progress, difficulty, favorites, custom lists, and offline status.
- [x] Build the Daily Study Plan with vocabulary, tense, and shadowing tasks.
- [x] Build the progress dashboard with accuracy, streak, mastery, and practice summaries.
- [x] Add difficulty filters and difficulty-aware quiz selection.
- [x] Add favorites and custom word lists with persistence.
- [x] Add pronunciation comparison using playback and browser speech recognition without storing audio.
- [x] Add offline support with a service worker and installable app metadata.
- [x] Validate all features on desktop and mobile, then save and publish.

## Dedicated vocabulary sections

- [x] Add dedicated Everyday Vocabulary entry point and focused shelf state.
- [x] Add dedicated Academic Vocabulary entry point and focused shelf state.
- [x] Add dedicated Business Vocabulary entry point and focused shelf state.
- [x] Validate counts, search, filters, responsive layout, and study actions.
- [x] Save and publish the vocabulary section update.

## AI example sentences

- [x] Add a server-side AI sentence-generation route using the built-in LLM helper.
- [x] Add a structured one-sentence response with word, meaning, and category context.
- [x] Add generate, loading, retry, fallback, and audio controls to word details.
- [x] Validate error handling, responsive layout, and production build.
- [x] Save and publish the AI sentence feature.

## AI sentence difficulty selector

- [x] Add Beginner, Intermediate, and Advanced difficulty input validation to the sentence procedure.
- [x] Add a persisted difficulty dropdown to the AI sentence panel.
- [x] Include the selected difficulty in the generation prompt and generated result state.
- [x] Validate loading, retry, fallback, audio, and production build behavior.
- [x] Save and publish the difficulty-selector update.

## Advanced AI sentence practice

- [x] Add context selection for conversation, academic writing, business, travel, and exam practice.
- [x] Add sentence-style selection for statement, question, negative, and contrast sentence forms.
- [x] Request richer AI output with sentence, translation-free usage note, collocations, and a follow-up challenge.
- [x] Add generated-result cards with pronunciation, copy, regenerate, and challenge controls.
- [x] Validate advanced controls, fallback behavior, audio, and production build.
- [x] Save and publish the advanced sentence-practice update.

## US Phonetics practice

- [x] Add a curated US-English IPA sound library with vowel and consonant groups.
- [x] Add example words, mouth/placement guidance, and common sound notes for each phoneme.
- [x] Add a dedicated US Phonetics navigation entry and responsive practice cards.
- [x] Add US-English audio playback, repeat controls, and practiced-state persistence.
- [x] Validate phonetics navigation, audio controls, mobile layout, and production build.
- [x] Save and publish the US Phonetics section.

## Minimal-pair listening quiz

- [x] Add a curated minimal-pair quiz bank covering common US-English sound contrasts.
- [x] Add a dedicated quiz navigation entry and one-question listening flow.
- [x] Add US-English playback, two-choice answer selection, instant feedback, and explanations.
- [x] Add score, streak, next-question, completion, and persisted progress behavior.
- [x] Validate audio, scoring, persistence, mobile layout, and production build.
- [x] Save and publish the minimal-pair listening quiz.

## Minimal-pair verification follow-up

- [x] Add an explicit full-quiz completion summary with reset behavior.
- [x] Verify the Minimal Pairs section at a mobile viewport and confirm its listening controls remain usable.
- [x] Save and publish the final Minimal Pairs update after the completion-state fix.

## Vocabulary category filters

- [x] Add prominent Everyday, Academic, Business, and Literary filter chips to the Word Shelf.
- [x] Show live counts and keep search and difficulty filters compatible with category selection.
- [x] Preserve dedicated category navigation and add a clear active-filter state.
- [x] Validate category switching, empty states, responsive layout, and production build.
- [x] Save and publish the category-filter update.

## Vocabulary filter verification follow-up

- [x] Add an explicit empty-state message for no matching words.
- [x] Re-verify category switching on desktop and mobile with only matching words visible.
- [x] Save and publish the final category-filter update after verification.

## US Phonetics visibility follow-up

- [x] Add a prominent US Phonetics card to the Learning Dashboard.
- [x] Add a clear direct practice action and mobile-visible navigation label for US Phonetics.
- [x] Verify the phonetics entry point and sound cards on desktop and mobile.
- [x] Save and publish the visible phonetics update.

## Mobile install option

- [x] Add browser install-prompt state and installed-state detection.
- [x] Add an Install Vocab Studio action to the mobile-visible interface.
- [x] Add iOS and unsupported-browser fallback instructions.
- [x] Validate manifest, service worker, install UI, responsive layout, and production build.
- [x] Save and publish the mobile install option.

## Offline study packs

- [x] Define pack metadata, local storage keys, and download status states.
- [x] Add download and remove controls for Everyday, Academic, Business, Literary, and US Phonetics packs.
- [x] Add offline-pack status to the dashboard and study navigation.
- [x] Ensure saved packs remain usable offline with clear unavailable-data states.
- [x] Validate pack transitions, service-worker caching, responsive UI, and production build.
- [x] Save and publish offline study-pack controls.

## Offline pack verification follow-up

- [x] Add an offline-pack indicator to the study rail so saved-pack status is visible outside the dashboard.
- [x] Add study-pack actions and clear unavailable-offline messaging for packs that are not saved.
- [x] Verify pack save/remove transitions and the Cache Storage path, then publish the final offline-pack update.

## GitHub Pages synchronization

- [x] Compare GitHub main with the latest verified Vocab Studio checkpoint.
- [x] Push the latest build and deployment workflow to the user’s GitHub repository.
- [x] Verify GitHub Actions completes and the deployed site includes Dashboard and US Phonetics.
- [x] Report the correct URL, cache-refresh steps, and deployment state.

## GitHub Pages root-route fix

- [x] Add a GitHub Pages fallback redirect so the repository URL opens index.html instead of showing 404.
- [x] Push the redirect and verify both the root URL and explicit index URL.

## Phonetics sound playback

- [x] Add a clearly labeled Play sound control for every IPA phoneme.
- [x] Add individual US-English playback controls for example words and repeat practice.
- [x] Add active speaking state, stop behavior, and unsupported-browser feedback.
- [x] Validate phonetics audio controls, responsive layout, and GitHub Pages deployment.
- [x] Save and publish the phonetics sound update.

## Mobile clean UI and smooth performance

- [x] Audit mobile layout overflow, tap targets, navigation, and loading behavior.
- [x] Improve phone spacing, typography, cards, filters, and fixed navigation behavior.
- [x] Reduce perceived hangs with progressive loading, guarded speech actions, and responsive feedback.
- [x] Validate core phone flows, TypeScript, tests, production build, and screenshots.
- [x] Save and publish the mobile optimization update.

## Mobile-first redesign and fast runtime

- [x] Audit current mobile composition, interaction density, bundle loading, and render hotspots.
- [x] Introduce a clearer mobile-first visual hierarchy and adjustable responsive layout.
- [x] Reduce first-load work and prevent repeated expensive renders or interaction stalls.
- [x] Test mobile first, then desktop, core study flows, TypeScript, tests, and production build.
- [x] Save and publish the redesigned fast experience.
