// SAP Integration Configuration
// Switch between mock data and real SAP connection

module.exports = {
  // Integration mode: 'mock' | 'sap-api-hub' | 'sap-cloud' | 'erpnext'
  mode: process.env.SAP_MODE || 'mock',
  
  // SAP API Business Hub (Sandbox)
  sapApiHub: {
    baseUrl: 'https://sandbox.api.sap.com/s4hanacloud',
    apiKey: process.env.SAP_API_KEY || '',
    endpoints: {
      materials: '/API_MATERIAL_STOCK_SRV/A_MaterialStock',
      purchaseOrders: '/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder',
      salesOrders: '/API_SALES_ORDER_SRV/A_SalesOrder',
      stock: '/API_MATERIAL_STOCK_SRV/A_MatlStkInAcctMod'
    }
  },
  
  // SAP Cloud Platform (Trial/Production)
  sapCloud: {
    baseUrl: process.env.SAP_CLOUD_URL || '',
    username: process.env.SAP_USERNAME || '',
    password: process.env.SAP_PASSWORD || '',
    client: process.env.SAP_CLIENT || '100',
    endpoints: {
      materials: '/sap/opu/odata/sap/API_MATERIAL_STOCK_SRV/A_MaterialStock',
      purchaseOrders: '/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder',
      salesOrders: '/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder'
    }
  },
  
  // ERPNext (Open Source Alternative)
  erpNext: {
    baseUrl: process.env.ERPNEXT_URL || 'https://demo.erpnext.com',
    apiKey: process.env.ERPNEXT_API_KEY || '',
    apiSecret: process.env.ERPNEXT_API_SECRET || '',
    endpoints: {
      items: '/api/resource/Item',
      stock: '/api/resource/Stock Ledger Entry',
      purchaseOrders: '/api/resource/Purchase Order',
      salesOrders: '/api/resource/Sales Order'
    }
  },
  
  // Mock data settings (current mode)
  mock: {
    enabled: true,
    dataSource: './api/data/sap-data.js'
  }
};
