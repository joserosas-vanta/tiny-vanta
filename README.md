## Azure Virtual Machine Fetcher

### Prerequisites

Before running the application, ensure you have the following:

- Node.js installed on your machine (version 12 or higher)
- An Azure subscription
- Azure credentials (subscription ID, tenant ID, client ID, client secret)

### Setup

1. Clone this repository to your local machine.

2. Open a terminal and navigate to the project directory.

3. Install the required dependencies by running the following command:
   ```
   npm install
   ```

4. Create a new file named `credentials.yaml` in the `config` directory.

5. Open the `credentials.yaml` file and provide your Azure credentials in the following format:
   ```yaml
   subscriptionId: "your-subscription-id-here"
   tenantId: "your-tenant-id-here"
   clientId: "your-client-id-here"
   clientSecret: "your-client-secret-here"
   ```
   Replace the placeholders with your actual Azure credentials:
   - `your-subscription-id-here`: The unique identifier of your Azure subscription.
   - `your-tenant-id-here`: The unique identifier of your Azure Active Directory (Azure AD) tenant.
   - `your-client-id-here`: The client ID (application ID) of your Azure AD application (service principal).
   - `your-client-secret-here`: The client secret associated with your Azure AD application (service principal).

   Make sure to keep the `credentials.yaml` file secure and do not share it publicly, as it contains sensitive information.

### Running the Application

To run the application, use the following command:
```
node src/index.js
```

By default, the application will fetch the virtual machines from your Azure subscription and display the total count of virtual machines found.

If you want to see more detailed information about each virtual machine, you can run the application with the `--verbose` flag:
```
node src/index.js --verbose
```

This will display the name, ID, location, and provisioning state of each virtual machine, in addition to the total count.
