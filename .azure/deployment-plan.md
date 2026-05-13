# 🌲 Bosque Digital - Azure Deployment Plan

**Project**: Bosque Digital (Node.js + Express + Azure SQL)  
**Target**: Azure App Service (Linux)  
**Status**: PLANNING  
**Date**: May 12, 2026  

---

## Phase 1: Planning

### Workspace Analysis
- **Mode**: MODIFY (existing Node.js project)
- **Stack**: Node.js 18+ / Express.js
- **Database**: Azure SQL Server (already connected)
- **Deployment Target**: Azure App Service (Linux)
- **Resource Group**: Already created (user confirmation needed)

### Infrastructure Stack Decision
- **IaC Format**: Bicep
- **Services**:
  - ✅ Azure App Service (Linux)
  - ✅ Azure App Service Plan (Linux)
  - ✅ Application Insights (APM)
  - ✅ Key Vault (for secrets management)
  - ✅ Managed Identity (for secure authentication)

### Environment & Configuration
- **Region**: User to confirm
- **Node.js Version**: 18.x LTS
- **Environment Variables**: From .env file
- **Secrets**: Move to Key Vault
  - `DB_PASSWORD`
  - `JWT_SECRET`

---

## Phase 2: Preparation

### Artifacts to Generate
- [ ] `.azure/deployment-plan.md` (this file) - COMPLETE
- [ ] `azure.yaml` - app metadata for azd
- [ ] `infra/main.bicep` - main infrastructure template
- [ ] `infra/app-service.bicep` - app service resources
- [ ] `infra/key-vault.bicep` - secrets management
- [ ] `.gitignore` - exclude local files
- [ ] `Dockerfile` (optional) - for containerization

### Deployment Steps
1. **Prepare**: Generate infrastructure code
2. **Validate**: Check configuration with azure-validate
3. **Deploy**: Execute with azure-deploy (azd up)

---

## Phase 3: Deployment

**Prerequisites**:
- ✅ Azure CLI installed
- ✅ azd CLI installed  
- ✅ Resource Group created
- ✅ Authenticated to Azure

**Deployment Command**:
```bash
azd up
```

This will:
1. Create Azure resources (App Service, Key Vault, etc.)
2. Build and deploy your Node.js app
3. Configure environment variables
4. Set up Application Insights monitoring

---

## Configuration Needed from User

- [ ] **Azure Subscription ID**: (ask)
- [ ] **Region**: (e.g., eastus, westeurope)
- [ ] **Resource Group Name**: (already created - confirm name)
- [ ] **App Name**: (e.g., bosque-digital-prod)
- [ ] **Environment**: development, staging, production

---

## Next Steps

1. Approve this plan
2. Provide subscription/region details
3. Execute infrastructure generation
4. Validate configuration
5. Deploy to Azure

---
**Status**: AWAITING APPROVAL
