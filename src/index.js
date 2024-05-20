const { ClientSecretCredential } = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { NetworkManagementClient } = require("@azure/arm-network");
const fs = require("fs");
const yaml = require("js-yaml");

function loadCredentials() {
  const yamlFile = fs.readFileSync("config/credentials.yaml", "utf8");
  return yaml.load(yamlFile);
}

async function main() {
  const credentials = loadCredentials();
  const { subscriptionId, tenantId, clientId, clientSecret } = credentials;

  const credential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret,
  );

  const computeClient = new ComputeManagementClient(credential, subscriptionId);
  const networkClient = new NetworkManagementClient(credential, subscriptionId);

  try {
    console.log("Fetching virtual machines...");
    const virtualMachinesIterator = computeClient.virtualMachines.listAll();
    let vmCount = 0;
    const verbose = process.argv.includes("--verbose");

    for await (const vm of virtualMachinesIterator) {
      vmCount++;

      if (verbose) {
        console.log("Virtual Machine:");
        console.log(`- Name: ${vm.name}`);
        console.log(`  ID: ${vm.id}`);
        console.log(`  Location: ${vm.location}`);
        console.log(`  Provisioning State: ${vm.provisioningState}`);
        console.log("---");
      }
    }

    console.log(
      `Found ${vmCount} virtual machines under subscription ${subscriptionId}`,
    );
  } catch (error) {
    console.error("Error fetching virtual machines:", error);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
