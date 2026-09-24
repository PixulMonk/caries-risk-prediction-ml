.PHONY: install dev dev-web dev-server

install:
	cd apps/web && npm install
	cd apps/server && uv sync

dev-web:
	cd apps/web && npm run dev

dev-server:
	cd apps/server && uv run uvicorn src.main:app --reload

dev:
	$(MAKE) -j2 dev-web dev-server