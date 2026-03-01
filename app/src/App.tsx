import { Router, Route, Navigate } from '@solidjs/router'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { NobelPrizes } from './pages/NobelPrizes'
import { Tier1Awards } from './pages/Tier1Awards'
import { Awards } from './pages/Awards'
import { FrontierTopics } from './pages/FrontierTopics'
import { FrontierTopicDetail } from './pages/FrontierTopicDetail'
import { Institutions } from './pages/Institutions'
import { Schema } from './pages/Schema'
import { Sitemap } from './pages/Sitemap'

export default function App() {
  return (
    <Router>
      <Route path="/" component={() => <Navigate href="/en/dashboard" />} />
      <Route path="/:lang" component={Layout}>
        <Route path="/" component={() => <Navigate href="dashboard" />} />
        <Route path="dashboard" component={Dashboard} />
        <Route path="nobel" component={NobelPrizes} />
        <Route path="nobel/:category" component={NobelPrizes} />
        <Route path="tier1-awards" component={Tier1Awards} />
        <Route path="awards" component={Awards} />
        <Route path="frontier-topics" component={FrontierTopics} />
        <Route path="frontier-topics/:id" component={FrontierTopicDetail} />
        <Route path="institutions" component={Institutions} />
        <Route path="schema" component={Schema} />
        <Route path="sitemap" component={Sitemap} />
      </Route>
      <Route path="*404" component={() => <Navigate href="/en/dashboard" />} />
    </Router>
  )
}
