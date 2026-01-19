import { Invoice } from '../shared/schema';
import { storage } from './storage';
import { format } from 'date-fns';
import crypto from 'crypto';
import { APP_NAME } from './seo/app-config';

/**
 * Servicio para generar PDFs de facturas
 */
export class InvoicePdfService {
  /**
   * Genera un PDF para una factura específica
   * @param invoiceId ID de la factura
   * @returns Buffer con el PDF generado
   */
  static async generatePdf(invoiceId: number): Promise<Buffer> {
    try {
      // Obtener la factura de la base de datos
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        throw new Error(`Invoice with ID ${invoiceId} not found`);
      }
      
      // Validación básica del objeto invoice
      if (!invoice || typeof invoice !== 'object') {
        console.error('Invalid invoice data: not an object');
        throw new Error('Invalid invoice data');
      }
      
      // Si la factura tiene un perfil de facturación, obtenemos los datos completos del perfil
      let billingProfile = null;
      if (invoice.billingProfileId) {
        try {
          billingProfile = await storage.getBillingProfile(invoice.billingProfileId);
        } catch (err) {
          console.warn(`No se pudo obtener el perfil de facturación para la factura ${invoiceId}:`, err);
        }
      }
      
      // Generamos un HTML que el navegador pueda renderizar como PDF 
      const html = this.renderPdfAsHtml(invoice, billingProfile);
      
      // Convertir a buffer
      return Buffer.from(html, 'utf-8');
    } catch (error) {
      console.error(`Error generando PDF para la factura ${invoiceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Renderiza el PDF como un documento HTML que pueda ser visualizado como PDF
   * @param invoice Datos de la factura
   * @param billingProfile Perfil de facturación asociado (opcional)
   * @returns Documento HTML para PDF
   */
  private static renderPdfAsHtml(invoice: Invoice, billingProfile: any = null): string {
    const {
      id,
      invoiceNumber,
      walletAddress,
      positionId,
      amount,
      status,
      paymentMethod,
      transactionHash,
      bankReference,
      issueDate,
      paidDate,
      dueDate,
      notes,
      clientName,
      clientAddress,
      clientCity,
      clientCountry,
      clientTaxId,
      additionalData
    } = invoice;
    
    // Formateamos las fechas
    const issueDateFormatted = issueDate ? format(new Date(issueDate), 'dd/MM/yyyy') : 'N/A';
    const paymentDateFormatted = paidDate ? format(new Date(paidDate), 'dd/MM/yyyy') : 'N/A';
    const dueDateFormatted = dueDate ? format(new Date(dueDate), 'dd/MM/yyyy') : 'N/A';
    
    // Usamos los datos del perfil de facturación si están disponibles, si no, usamos los datos de la factura
    const finalClientName = (billingProfile?.companyName || billingProfile?.fullName || clientName || '').trim();
    const finalClientAddress = (billingProfile?.address || clientAddress || '').trim();
    const finalClientCity = (billingProfile?.city || clientCity || '').trim();
    const finalClientCountry = (billingProfile?.country || clientCountry || '').trim();
    const finalClientTaxId = (billingProfile?.taxId || clientTaxId || '').trim();
    const finalClientPhone = (billingProfile?.phone || '').trim();
    const finalClientEmail = (billingProfile?.email || '').trim();
    
    // Extraer datos adicionales si existen
    const poolName = additionalData && typeof additionalData === 'object' && 'poolName' in additionalData 
      ? additionalData.poolName as string 
      : '';
    const timeframe = additionalData && typeof additionalData === 'object' && 'timeframe' in additionalData 
      ? additionalData.timeframe as number | string 
      : '';
    
    // Mostrar el hash de transacción completo por temas legales
    const formattedHash = transactionHash ? transactionHash : 'Pending';
      
    // Generar un ID único para el código QR basado en el número de factura
    const qrCodeId = `qr-${invoiceNumber.replace(/\s/g, '').toLowerCase()}`;
    
    // Formatear el estado
    const statusText = status.toUpperCase();
    const statusClass = status.toLowerCase() === 'paid' ? 'paid' : status.toLowerCase() === 'pending' ? 'pending' : 'cancelled';
    
    // Decoración blockchain para el pie de página
    const blockchainTimestamp = Math.floor(Date.now() / 1000);
    const blockchainHash = crypto.createHash('sha256').update(`${invoiceNumber}-${blockchainTimestamp}`).digest('hex').substring(0, 16);
    
    // Verificar el estado de verificación del perfil de facturación
    const verificationStatus = billingProfile?.verificationStatus || 'Pending';
    const verificationDate = billingProfile?.verificationTimestamp ? new Date(billingProfile.verificationTimestamp) : null;
    const verificationDateFormatted = verificationDate ? format(verificationDate, 'dd/MM/yyyy HH:mm:ss') : 'N/A';
    const verificationHash = billingProfile?.verificationHash || '';
    
    // Clase y texto para el estado de verificación
    const verificationStatusClass = verificationStatus === 'Verified' ? 'verified' : verificationStatus === 'Rejected' ? 'rejected' : 'pending';
    const verificationStatusText = verificationStatus.toUpperCase();
    
    // Generar el contenido HTML del PDF con estilo blockchain
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceNumber}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
            --primary-color: #4338ca;
            --primary-light: #6366f1;
            --primary-dark: #3730a3;
            --secondary-color: #0f172a;
            --accent-color: #f59e0b;
            --background-color: #ffffff;
            --text-color: #1e293b;
            --text-light: #64748b;
            --border-color: #e2e8f0;
            --border-radius: 8px;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 10px;
            color: var(--text-color);
            line-height: 1.6;
            background-color: var(--background-color);
            font-size: 14px;
        }
        
        .invoice-container {
            max-width: 1000px; /* Aumentado de 800px a 1000px para aprovechar mejor el ancho A4 */
            margin: 0 auto;
            background: linear-gradient(to bottom right, #fcfcfc, #f8fafc);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow);
            position: relative;
        }
        
        .blockchain-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 0;
        }
        
        .invoice-header {
            position: relative;
            padding: 30px 40px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            border-bottom: 5px solid var(--accent-color);
            z-index: 1;
        }
        
        .logo-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .company-details {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .invoice-title-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .invoice-title {
            font-size: 32px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        
        .invoice-number {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }
        
        .invoice-date {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .status-badge {
            padding: 8px 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 50px;
            font-size: 14px;
            display: inline-block;
            text-align: center;
            min-width: 120px;
        }
        
        .status-paid {
            background-color: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.4);
        }
        
        .status-pending {
            background-color: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }
        
        .status-cancelled {
            background-color: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        
        /* Estilos para el estado de verificación */
        .verification-badge {
            padding: 6px 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 50px;
            font-size: 12px;
            display: inline-block;
            text-align: center;
            margin-top: 10px;
        }
        
        .verification-verified {
            background-color: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.4);
        }
        
        .verification-pending {
            background-color: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }
        
        .verification-rejected {
            background-color: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        
        .verification-info {
            margin-top: 10px;
            font-size: 12px;
            color: var(--text-light);
        }
        
        .verification-hash {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background-color: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 5px;
            word-break: break-all;
        }
        
        .invoice-body {
            position: relative;
            padding: 30px 25px; /* Reducido de 40px a 30px vertical y 25px horizontal */
            z-index: 1;
        }
        
        .detail-columns {
            display: flex;
            flex-wrap: wrap;
            gap: 20px; /* Reducido de 30px a 20px */
            margin-bottom: 20px; /* Reducido de 30px a 20px */
        }
        
        .detail-column {
            flex: 1;
            min-width: 250px;
        }
        
        .detail-block {
            margin-bottom: 20px; /* Reducido de 30px a 20px */
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: var(--border-radius);
            padding: 15px; /* Reducido de 20px a 15px */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            border-left: 4px solid var(--primary-color);
        }
        
        .detail-block-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
        }
        
        .detail-block-title::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: var(--primary-color);
            margin-right: 8px;
            border-radius: 50%;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 8px;
            align-items: flex-start;
        }
        
        .detail-label {
            width: 40%;
            font-weight: 500;
            color: var(--text-light);
            padding-right: 10px;
        }
        
        .detail-value {
            width: 60%;
            font-weight: 500;
            word-break: break-word;
        }
        
        .detail-value.hash {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            background-color: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        
        .payment-details {
            background-color: rgba(99, 102, 241, 0.05);
            border-radius: var(--border-radius);
            padding: 15px; /* Reducido de 20px a 15px */
            margin-bottom: 20px; /* Reducido de 30px a 20px */
            border: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .payment-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--primary-color);
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
            padding-bottom: 8px;
            text-transform: uppercase;
        }
        
        .payment-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .payment-method, .bank-info {
            flex: 1;
            min-width: 250px;
        }
        
        .payment-method-title, .bank-info-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--primary-dark);
        }
        
        .payment-method-box {
            background-color: white;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
        }
        
        .amount-section {
            background-color: rgba(15, 23, 42, 0.03);
            border-radius: var(--border-radius);
            padding: 15px; /* Reducido de 20px a 15px */
            margin-bottom: 20px; /* Reducido de 30px a 20px */
        }
        
        .amount-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-light);
            margin-bottom: 10px;
        }
        
        .amount-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--secondary-color);
        }
        
        .terms-block {
            margin-top: 15px; /* Reducido de 30px a 15px */
            padding: 15px; /* Reducido de 20px a 15px */
            background-color: rgba(15, 23, 42, 0.03);
            border-radius: var(--border-radius);
            font-size: 12px;
        }
        
        .terms-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .terms-content {
            color: var(--text-light);
        }
        
        .dotted-separator {
            border: none;
            border-top: 1px dashed rgba(99, 102, 241, 0.3);
            margin: 20px 0; /* Reducido de 30px a 20px */
        }
        
        .crypto-box {
            background-color: rgba(249, 250, 251, 0.8);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
            display: flex;
            align-items: center;
            margin-top: 15px;
        }
        
        .crypto-address {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: var(--text-color);
            background-color: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 10px;
        }
        
        .qr-code-container {
            width: 80px;
            height: 80px;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }
        
        .invoice-footer {
            text-align: center;
            padding: 15px 25px 20px; /* Reducido de 20px 40px 30px a 15px 25px 20px */
            background-color: var(--secondary-color);
            color: white;
            position: relative;
            z-index: 1;
        }
        
        .footer-company {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .footer-details {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .footer-tagline {
            margin-top: 10px;
            font-style: italic;
            opacity: 0.7;
            font-size: 11px;
        }
        
        /* Decoración estilo blockchain */
        .blockchain-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .blockchain-badge:before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            margin-right: 6px;
        }
        
        .blockchain-decoration {
            position: absolute;
            bottom: 5px; /* Reducido de 10px a 5px */
            left: 25px; /* Reducido de 40px a 25px para adaptarlo al nuevo padding del footer */
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
        }
        
        /* Ajustes para impresión */
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white;
            }
            
            .invoice-container {
                box-shadow: none;
                max-width: 100%;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="blockchain-pattern"></div>
        
        <div class="invoice-header">
            <div class="blockchain-badge">Blockchain Verified</div>
            
            <div class="logo-area">
                <div class="company-info">
                    <div class="company-name">WayBank</div>
                    <div class="company-details">Blockchain Liquidity Management Services</div>
                </div>
            </div>
            
            <div class="invoice-title-section">
                <div>
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-number">${invoiceNumber}</div>
                    <div class="invoice-date">Issue Date: ${issueDateFormatted}</div>
                </div>
                <div class="status-badge status-${statusClass}">
                    ${statusText}
                </div>
            </div>
        </div>
        
        <div class="invoice-body">
            <div class="detail-columns">
                <div class="detail-column">
                    <div class="detail-block">
                        <div class="detail-block-title">Company Details</div>
                        <div class="detail-row">
                            <div class="detail-label">Company:</div>
                            <div class="detail-value">ELYSIUM MEDIA - FZCO</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Registration ID:</div>
                            <div class="detail-value">58510</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Address:</div>
                            <div class="detail-value">IFZA Business Park, DDP, DUBAI, UAE</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Tax Registration:</div>
                            <div class="detail-value">100437930500003</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-column">
                    <div class="detail-block">
                        <div class="detail-block-title">Client Information</div>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">${finalClientName || 'N/A'}</div>
                        </div>
                        ${finalClientAddress ? `
                        <div class="detail-row">
                            <div class="detail-label">Address:</div>
                            <div class="detail-value">${finalClientAddress}</div>
                        </div>` : ''}
                        ${(finalClientCity || finalClientCountry) ? `
                        <div class="detail-row">
                            <div class="detail-label">Location:</div>
                            <div class="detail-value">${[finalClientCity, finalClientCountry].filter(Boolean).join(', ')}</div>
                        </div>` : ''}
                        ${finalClientTaxId ? `
                        <div class="detail-row">
                            <div class="detail-label">Tax ID:</div>
                            <div class="detail-value">${finalClientTaxId}</div>
                        </div>` : ''}
                        ${finalClientPhone ? `
                        <div class="detail-row">
                            <div class="detail-label">Phone:</div>
                            <div class="detail-value">${finalClientPhone}</div>
                        </div>` : ''}
                        ${finalClientEmail ? `
                        <div class="detail-row">
                            <div class="detail-label">Email:</div>
                            <div class="detail-value">${finalClientEmail}</div>
                        </div>` : ''}
                        <div class="detail-row">
                            <div class="detail-label">Wallet Address:</div>
                            <div class="detail-value hash">${walletAddress}</div>
                        </div>
                        <div class="verification-badge verification-${verificationStatusClass}">
                            Wallet ${verificationStatusText}
                        </div>
                        ${verificationStatus === 'Verified' && verificationHash ? `
                        <div class="verification-info">
                            <div>Verificado en: ${verificationDateFormatted}</div>
                            <div class="verification-hash">Hash: ${verificationHash}</div>
                        </div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="amount-section">
                <div class="amount-title">Invoice Amount</div>
                <div class="amount-value">$${amount} USD</div>
            </div>
            
            <div class="detail-block">
                <div class="detail-block-title">Service Details</div>
                <div class="detail-row">
                    <div class="detail-label">Position ID:</div>
                    <div class="detail-value">${positionId || 'N/A'}</div>
                </div>
                ${poolName ? `
                <div class="detail-row">
                    <div class="detail-label">Pool:</div>
                    <div class="detail-value">${poolName}</div>
                </div>` : ''}
                ${timeframe ? `
                <div class="detail-row">
                    <div class="detail-label">Timeframe:</div>
                    <div class="detail-value">${timeframe} days</div>
                </div>` : ''}
                <div class="detail-row">
                    <div class="detail-label">Issue Date:</div>
                    <div class="detail-value">${issueDateFormatted}</div>
                </div>
                ${dueDate ? `
                <div class="detail-row">
                    <div class="detail-label">Due Date:</div>
                    <div class="detail-value">${dueDateFormatted}</div>
                </div>` : ''}
                ${paidDate ? `
                <div class="detail-row">
                    <div class="detail-label">Payment Date:</div>
                    <div class="detail-value">${paymentDateFormatted}</div>
                </div>` : ''}
                ${notes ? `
                <div class="detail-row">
                    <div class="detail-label">Description:</div>
                    <div class="detail-value">${notes}</div>
                </div>` : ''}
                ${transactionHash ? `
                <div class="detail-row">
                    <div class="detail-label">Transaction Hash:</div>
                    <div class="detail-value hash">${formattedHash}</div>
                </div>` : ''}
                ${bankReference ? `
                <div class="detail-row">
                    <div class="detail-label">Bank Reference:</div>
                    <div class="detail-value">${bankReference}</div>
                </div>` : ''}
                ${paymentMethod ? `
                <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value">${paymentMethod}</div>
                </div>` : ''}
            </div>
            
            <div class="payment-details">
                <div class="payment-title">Payment Information</div>
                <div class="payment-info">
                    <div class="payment-method">
                        <div class="payment-method-title">Payment Instructions</div>
                        <div class="payment-method-box">
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 8px;">• Please include the invoice number in all payments</li>
                                <li style="margin-bottom: 8px;">• All payments must be made in USD</li>
                                <li style="margin-bottom: 8px;">• Bank charges are the responsibility of the payer</li>
                                <li>• For crypto payments, contact support@waybank.info</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="bank-info">
                        <div class="bank-info-title">Bank Details</div>
                        <div class="payment-method-box">
                            <div style="margin-bottom: 5px;"><strong>ELYSIUM MEDIA - FZCO</strong></div>
                            <div style="margin-bottom: 5px;"><strong>IBAN:</strong> AE590860000009839365601</div>
                            <div style="margin-bottom: 5px;"><strong>BIC:</strong> WIOBAEADXXX</div>
                            <div style="margin-bottom: 5px;"><strong>Bank:</strong> Wio Bank PJSC</div>
                            <div><strong>Address:</strong> Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr class="dotted-separator">
            
            <div class="terms-block">
                <div class="terms-title">Terms and Conditions</div>
                <div class="terms-content">
                    <p style="margin-bottom: 8px;">This invoice is subject to the terms and conditions of the ${APP_NAME} service. Please review our complete terms of service at <strong>https://waybank.info/terms-of-use</strong>.</p>
                    <p style="margin-bottom: 8px;">Esta factura está sujeta a los términos y condiciones del servicio ${APP_NAME}. Revise nuestros términos de servicio completos en <strong>https://waybank.info/terms-of-use</strong>.</p>
                </div>
            </div>
            
            <div class="terms-block" style="margin-top: 15px;">
                <div class="terms-title">Legal Notice</div>
                <div class="terms-content">
                    <p style="margin-bottom: 8px;">This document is an official invoice issued by ELYSIUM MEDIA - FZCO, a company registered in the UAE under license number 58510. This invoice complies with UAE tax regulations.</p>
                    <p>Este documento es una factura oficial emitida por ELYSIUM MEDIA - FZCO, una empresa registrada en EAU con número de licencia 58510. Esta factura cumple con las regulaciones fiscales de EAU.</p>
                </div>
            </div>
        </div>
        
        <div class="invoice-footer">
            <div class="footer-company">${APP_NAME}</div>
            <div class="footer-details">Blockchain Liquidity Management Services</div>
            <div class="footer-details">https://waybank.info</div>
            <div class="footer-tagline">Secured with Blockchain Technology</div>
            <div class="blockchain-decoration">
                Invoice: ${invoiceNumber} | Block: ${blockchainTimestamp} | Verification: ${verificationStatus} 
                ${verificationStatus === 'Verified' ? `| Time: ${verificationDateFormatted}` : ''}
                | Hash: 0x${blockchainHash}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}