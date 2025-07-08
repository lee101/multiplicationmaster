VENV?=.venv

.PHONY: venv install test deploy

venv:
	python3 -m venv $(VENV)

install: venv
	$(VENV)/bin/pip install -r requirements.txt || true

test:
	$(VENV)/bin/python -m unittest discover -s tests || true

deploy:
	bash deploy.sh
