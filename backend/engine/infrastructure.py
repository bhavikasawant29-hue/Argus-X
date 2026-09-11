def build_infrastructure_map(timeline, events):
    hosts = set()
    users = set()
    ips = set()
    connections = []

    for event in events:
        if event.source_host:
            hosts.add(event.source_host)

        if event.destination_host:
            hosts.add(event.destination_host)

        if event.user:
            users.add(event.user)

        if event.source_ip:
            ips.add(event.source_ip)

    for event in timeline:
        source_host = event.get("source_host")
        destination_host = event.get("destination_host")

        if source_host:
            hosts.add(source_host)

        if destination_host:
            hosts.add(destination_host)

        if source_host and destination_host:
            connection = {
                "source": source_host,
                "destination": destination_host,
                "event_id": event["event_id"],
                "timestamp": event["timestamp"]
            }

            if connection not in connections:
                connections.append(connection)

    return {
        "hosts": sorted(hosts),
        "users": sorted(users),
        "source_ips": sorted(ips),
        "connections": connections,
        "host_count": len(hosts),
        "user_count": len(users),
        "ip_count": len(ips),
        "connection_count": len(connections)
    }