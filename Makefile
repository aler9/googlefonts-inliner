BASE_IMAGE = node:16-alpine3.16

help:
	@echo "usage: make [action]"
	@echo ""
	@echo "available actions:"
	@echo ""
	@echo "  test      run tests"
	@echo ""

include scripts/*.mk
