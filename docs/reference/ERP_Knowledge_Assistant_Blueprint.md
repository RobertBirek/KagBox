# KAG Box — Assistant Layer Blueprint

## Overview

The assistant layer routes user questions to the correct knowledge base, retrieves answers, and manages knowledge drafts. It is designed as a config-driven pipeline.

## Routing

Routing is based on:
- Keyword matching against question text
- Source URL domain analysis
- Content heuristics

Routes are defined in `scripts/lib/kagbox_mcp_core.mjs`.

## Pipeline

1. User submits question via MCP or dashboard
2. Router classifies question → selects KB
3. Answer module queries OpenSPG graph
4. Result is returned to user

## Knowledge Drafts

The write-side workflow:
1. User submits draft → saved to `downloads/knowledge_inbox/`
2. Draft can be promoted to a KB
3. Pipeline processes promoted drafts into the graph

## Configuration

All KB namespaces, routing rules, and prompts are defined in `scripts/lib/` — customize for your domain.
