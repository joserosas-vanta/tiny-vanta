const { ClientSecretCredential } = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { NetworkManagementClient } = require("@azure/arm-network");
const fs = require("fs");
const yaml = require("js-yaml");

console.log("test")

function loadCredentials() {
  const yamlFile = fs.readFileSync("config/credentials.yaml", "utf8");
  return yaml.load(yamlFile);
}

function validateCredentials(credentials) {
  const requiredFields = [
    "subscriptionId",
    "tenantId",
    "clientId",
    "clientSecret",
  ];
  const missingFields = requiredFields.filter((field) => !credentials[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing or invalid credentials. Please provide valid values for: ${missingFields.join(", ")}`,
    );
  }
}

async function main() {
  try {
    const credentials = loadCredentials();
    validateCredentials(credentials);

    const { subscriptionId, tenantId, clientId, clientSecret } = credentials;

    const credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret,
    );

    const computeClient = new ComputeManagementClient(
      credential,
      subscriptionId,
    );
    const networkClient = new NetworkManagementClient(
      credential,
      subscriptionId,
    );

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
    if (error.message.includes("Missing or invalid credentials")) {
      console.error("Error: " + error.message);
      console.error(
        "Please update the credentials.yaml file with valid Azure credentials.",
      );
    } else if (error.message.includes("invalid_request")) {
      console.error("Error: Invalid Azure credentials.");
      console.error(
        "Please check the values provided in the credentials.yaml file and ensure they are correct.",
      );
    } else {
      console.error("Error fetching virtual machines:", error);
    }
  }
}

main();
