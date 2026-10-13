import DOMPurify from 'dompurify'
import { resolveHtmlAssetPaths } from '../../content/resolveAssetPath'

// Course text is HTML written in the repo, and rendered with dangerouslySetInnerHTML. A content test already bans
// scripts and event handlers, but that only covers what is committed; sanitising at render keeps the app safe if
// content ever comes from somewhere else (a CMS, a contributor's paste). Inline styles are dropped too: looks come
// from the stylesheets and tokens.
const config = { FORBID_ATTR: ['style'], FORBID_TAGS: ['style', 'form', 'input', 'button'] }

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') node.setAttribute('rel', 'noopener noreferrer')
})

/** Content HTML made safe to inject: base-path-aware asset URLs, no scripts, handlers or inline styles. */
export const safeHtml = (html: string) => ({ __html: DOMPurify.sanitize(resolveHtmlAssetPaths(html), config) })

