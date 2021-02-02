FROM rethinkdb:2.4.1

RUN apt-get update && apt-get install -yq dnsutils vim-tiny && apt-get clean && rm -rf /var/lib/apt/lists

COPY rethinkdb.sh /bin/     

CMD ["bash", "/bin/rethinkdb.sh"]
