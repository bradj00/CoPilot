from typing import List

from loguru import logger

from app.agents.wazuh.schema.agents import WazuhAgentVulnerabilities
from app.agents.wazuh.schema.agents import WazuhAgentVulnerabilitiesResponse
from app.connectors.wazuh_manager.utils.universal import send_get_request


def collect_agent_vulnerabilities(agent_id: str):
    """Collect agent vulnerabilities from Wazuh Manager."""
    logger.info(f"Collecting agent {agent_id} vulnerabilities from Wazuh Manager")
    agent_vulnerabilities = send_get_request(endpoint=f"/vulnerability/{agent_id}")
    if agent_vulnerabilities["success"]:
        processed_vulnerabilities = process_agent_vulnerabilities(agent_vulnerabilities["data"])
        return WazuhAgentVulnerabilitiesResponse(
            vulnerabilities=processed_vulnerabilities,
            success=True,
            message="Vulnerabilities collected successfully",
        )


def process_agent_vulnerabilities(agent_vulnerabilities: dict) -> List[WazuhAgentVulnerabilities]:
    vulnerabilities = agent_vulnerabilities.get("data", {}).get("affected_items", [])
    return [WazuhAgentVulnerabilities(**vuln) for vuln in vulnerabilities]
