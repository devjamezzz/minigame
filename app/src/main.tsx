import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const normalizeLiffCallbackUrl = () => {
  const url = new URL(window.location.href)
  const liffState = url.searchParams.get('liff.state')
  if (!liffState || window.location.hash.startsWith('#/')) return

  let state = liffState
  try {
    state = decodeURIComponent(liffState)
  } catch {
    // LINE already decoded this value in some WebViews.
  }

  if (/^https?:\/\//i.test(state)) {
    const stateUrl = new URL(state)
    state = `${stateUrl.pathname}${stateUrl.search}${stateUrl.hash}`
  }

  const remainingParams = new URLSearchParams(url.search)
  remainingParams.delete('liff.state')
  remainingParams.delete('liff.referrer')

  const route = state.startsWith('#/')
    ? state
    : state.startsWith('/#/')
      ? state.slice(1)
      : state.startsWith('/')
        ? `#${state}`
        : state.startsWith('?')
          ? `#/${state}`
          : '#/'

  const search = remainingParams.toString()
  window.history.replaceState(
    null,
    '',
    `${url.pathname}${search ? `?${search}` : ''}${route}`,
  )
}

normalizeLiffCallbackUrl()

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
