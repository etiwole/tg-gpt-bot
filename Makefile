build:
	docker build -t etiwole_gpt_bot .

run:
	docker run -d -p 3030:3030 --name etiwole_gpt_bot --rm etiwole_gpt_bot