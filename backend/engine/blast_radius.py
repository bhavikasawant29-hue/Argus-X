CRITICAL_ASSETS = {
    "DB-01"
}


def calculate_blast_radius(timeline):
    affected_hosts = set()
    affected_users = set()
    attack_path = []

    for event in timeline:
        source_host = event.get("source_host")
        destination_host = event.get("destination_host")
        user = event.get("user")

        if source_host:
            affected_hosts.add(source_host)

        if destination_host:
            affected_hosts.add(destination_host)

        if user:
            affected_users.add(user)

        if source_host and destination_host:
            path = f"{source_host} -> {destination_host}"

            if path not in attack_path:
                attack_path.append(path)

    critical_assets = [
        host
        for host in affected_hosts
        if host in CRITICAL_ASSETS
    ]

    return {
        "affected_hosts": sorted(affected_hosts),
        "affected_users": sorted(affected_users),
        "critical_assets": sorted(critical_assets),
        "attack_path": attack_path,
        "host_count": len(affected_hosts),
        "user_count": len(affected_users),
        "critical_asset_count": len(critical_assets)
    }