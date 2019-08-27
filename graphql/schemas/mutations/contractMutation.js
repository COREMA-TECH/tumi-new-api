import { inputInsertContracts } from '../types/operations/insertTypes';
import { inputUpdateContracts } from '../types/operations/updateTypes';
import { ContractType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';
import moment from 'moment';
import AWS from 'aws-sdk';
import fs from 'fs';
import pdf from 'html-pdf';

import Db from '../../models/models';

const contractTemplate = () => {
    return `<!DOCTYPE html>,
    <html lang="en" style="zoom: 0.5">
       
       <head>
         
          <meta charset="UTF-8">
              
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
             
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
             
          <title>Document</title>
          
       </head>
       
       <body>
              
          <span style="text-align:justify; margin-top:250px;display: block;">
                     
             <p><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAGJCAIAAABaZiHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRDBCQ0YxQ0JCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRDBCQ0YxREJCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVEMEJDRjFBQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVEMEJDRjFCQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+D8DOXwAAD39JREFUeNrs3UuyG0UQ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",    ,                    alt="" width="504" height="auto" /></strong></p>
                         
             <p style="text-align: center;"><strong><span style="text-decoration: underline;">STAFFING AGREEMENT</span></strong></p>
                         
             <p style="text-align: center;"><strong>By and Between</strong></p>
                         
             <p style="text-align: center;"><strong>TUMI STAFFING INC.</strong></p>
                         
             <p style="text-align: center;"><strong>and</strong></p>
                         
             <p style="text-align: center;"><strong>{namecompany}</strong></p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <p style="text-align: center; margin-top:350px; display:block">Effective as of <a id="aGoBack"></a>{Today}</p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <p><strong>Table of Contents</strong></p>
                         
             <table style="height: 510px; width: 100%; border-collapse: collapse;" border="0">
                                
                <tbody>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 71.3592%; height: 17px;"><strong>1. Duties &amp; Responsibilities</strong></td>
                                              
                      <td style="width: 28.6408%; height: 17px; text-align: right;">3</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">1.1&nbsp;TUMI STAFFING</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">3</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">1.2&nbsp;HOTEL</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">3</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>2</strong>&nbsp;<strong>PAYMENT TERMS BILLING RATES,                                AND FEES</strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">4</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">2.1&nbsp;Rates; Payment; Invoicing</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">4</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">2.2&nbsp;Delinquent Payments</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">4</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">2.3&nbsp;Premium Billable Hours</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">4</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">2.4&nbsp;&nbsp;Labor Costs</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>3&nbsp;Term &amp; Termination </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">3.1&nbsp;Term</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">3.2&nbsp;Rate Adjustments</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">3.3&nbsp;Termination</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>4&nbsp;INSURANCE OBLIGATIONS </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">4.1 Insurance by TUMI STAFFING</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">5</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">4.2&nbsp;Insurance by HOTEL</td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">6</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>5&nbsp;<span style="text-decoration: underline;">PROTECTIONS</span>                            </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">6</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">5.1&nbsp;<span style="text-decoration: underline;">Non-Solicitation;                                Non-Circumvention</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">6</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>6&nbsp;<span style="text-decoration: underline;">Confidential,                                    Information</span> </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">7</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">6.1&nbsp;<span style="text-decoration: underline;">Use of                                Confidential Information</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">7</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">6.2&nbsp;<span style="text-decoration: underline;">Non-Attribution</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">6.3&nbsp;&nbsp;<span style="text-decoration: underline;">Survivability;                                Specific Performance</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>7&nbsp;<span style="text-decoration: underline;">INDEMNIFICATION</span>                            </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">7.1&nbsp;<span style="text-decoration: underline;">Duty to                                Indemnify; Procedure</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;">7.2&nbsp;<span style="text-decoration: underline;">Disclaimer                                of Consequential and Special Damages</span></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>8&nbsp;<span style="text-decoration: underline;">No                                    Guaranties</span> </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">8</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong>9 <span style="text-decoration: underline;">MISCELLANEOUS</span>                            </strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">9</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong><span style="text-decoration: underline;">EXHIBIT A                                    Rate Schedule</a></span></strong> <strong><br /></strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">11</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong><span style="text-decoration: underline;">EXHIBIT B,                                    Benefits Waiver</a> </span></strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">11</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong><span style="text-decoration: underline;">EXHIBIT C,                                    Staff Confidentiality Agreement</a> </span></strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">11</td>
                                          
                   </tr>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 28.6408%; height: 17px;"><strong><span style="text-decoration: underline;">EXHIBIT D,                                    Job Descriptions</a> </span></strong></td>
                                              
                      <td style="width: 71.3592%; height: 17px; text-align: right;">11</td>
                                          
                   </tr>
                                   
                </tbody>
                            
             </table>
                         
             <p>&nbsp;</p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <p style="text-align: center;">&nbsp;</p>
                         
             <h3 style="text-align: center;"><strong><span style="text-decoration: underline;">Staffing Agreement</span></strong></h3>
                         
             <p>This Staffing Agreement (&ldquo;the Agreement&rdquo;) executed by and between<strong> TUMI STAFFING INC.                </strong>a Texas corporation (&ldquo;<strong>TUMI STAFFING</strong>&rdquo;) and<strong> {namecompany}</strong>                (&ldquo;<strong>HOTEL</strong>&rdquo;) shall be effective as of {ContractStartDate} (&ldquo;Effective                Date&rdquo;). Tumi Staffing and HOTEL may be referred to individually as &ldquo;Party&rdquo; or collectively as                &ldquo;Parties&rdquo;.</p>
                         
             <p>HOTEL owns or operates the property Located at {directioncompany} (&ldquo;Property&rdquo;). TUMI STAFFING                provides staffing services for properties similar to or the same as Property. HOTEL intends for TUMI STAFFING                to provide staffing services necessary for operation of Property.</p>
                         
             <p>Therefore the Parties agree to the following:</p>
                         
             <hr />
                         
             <h3><strong>1. <a id="aToc524529518"></a>Duties &amp; Responsibilities</strong></h3>
                         
             <h4><strong>1.1. <a id="aToc225924510"></a><a id="aToc524529519"></a>TUMI STAFFING</strong></h4>
                         
             <p>TUMI STAFFING will:</p>
                         
             <p>a. Select employees (&ldquo;TUMI EMPLOYEES&rdquo;) to perform the type of work described in Exhibit D at the                location described therein;</p>
                         
             <p>b. Pay TUMI EMPLOYEES wages those wages being subject to all Federal State and Local taxes withholdings and                garnishments;</p>
                         
             <p>c. Pay withhold and transmit payroll taxes provide unemployment insurance workers&rsquo; compensation,                benefits and handle unemployment and workers&rsquo; compensation claims involving all TUMI EMPLOYEES;</p>
                         
             <p>d. <sup>Require TUMI EMPLOYEES assigned to work at the HOTEL to sign agreements (in the </sup>form of Exhibit B),                acknowledging that they are not entitled to payment of benefits paid by HOTEL to direct-hire employees of                HOTEL such benefits including vacations, disability benefits, insurance, pensions or retirement plans, or any                other benefits provided by HOTEL to its direct‐hire employees;</p>
                         
             <p>e. <sup>Require TUMI EMPLOYEES assigned to work at the HOTEL to sign confidentiality </sup>agreements (in the                form of Exhibit C) before they begin their assignments to HOTEL; and</p>
                         
             <h4><strong>1.2. <a id="aToc524529520"></a>HOTEL</strong></h4>
                         
             <p>HOTEL will:</p>
                         
             <p>a. Provide oversite of TUMI EMPLOYEES performing work for HOTEL and be responsible for timekeeping of TUMI,                EMPLOYEES hours and be responsible for HOTEL&rsquo;s business operations, products, services and intellectual                property;</p>
                         
             <p>b. Properly supervise, control, and safeguard HOTEL&rsquo;s Property, premises, processes, equipment, property                or systems and not permit TUMI EMPLOYEES to operate any vehicle or mobile equipment or entrust them with                unattended premises cash checks keys, credit cards, merchandise, confidential or trade secret information,                negotiable instruments, or other valuables without TUMI STAFFING&rsquo;s express prior written approval or as                strictly required by the job descriptions provided to TUMI STAFFING in Exhibit D of this Agreement;</p>
                         
             <p>c. Provide TUMI EMPLOYEES with a safe work site and provide appropriate information, training, and safety                equipment with respect to any hazardous substances or conditions to which they may be exposed at the work site;</p>
                         
             <p>d. Provide uniforms for TUMI EMPLOYEES;</p>
                         
             <p>e. Not change TUMI EMPLOYEES job duties without TUMI&rsquo;s express prior written approval;</p>
                         
             <p>f. Schedule TUMI EMPLOYEES on a weekly basis and provide copies of schedules and changes to schedules promptly                to TUMI STAFFING. Schedule requests and changes will be communicated promptly by both HOTEL and TUMI STAFFING.                HOTEL agrees to pay TUMI STAFFING a minimum 4 hours for any TUMI EMPLOYEE who arrives to work as scheduled but                is sent home before his work schedule is completed. Same day requests for employees will be subject to a rate                premium as outlined in Exhibit A.</p>
                         
             <p>g. Exclude TUMI EMPLOYEES from HOTEL&rsquo;s benefit plans;</p>
                         
             <p>h. Not make any comment, offer, or promise relating to TUMI EMPLOYEES&rsquo; compensation or benefits; and</p>
                         
             <p>i. Provide connectivity for TUMI STAFFING time clock via a direct dial telephone line or Internet connection.</p>
                         
             <h3><strong>2. <a id="aToc225924512"></a><a id="aToc524529521"></a>PAYMENT TERMS BILLING RATES AND FEES</strong></h3>
                         
             <h4><strong>2.1. <a id="aToc524529522"></a>Rates; Payment; Invoicing</strong></h4>
                         
             <p>HOTEL will pay TUMI STAFFING pursuant to the rates set forth on EXHIBIT A and will also pay any additional costs                or fees set forth in this Agreement. TUMI will invoice HOTEL on a weekly basis after such work is performed.                TUMI STAFFING will support each Invoice will be supported by the pertinent time sheets or other agreed system                for documenting time worked by TUMI EMPLOYEES. HOTEL&rsquo;s signature or other agreed method of approval of                the work time submitted for TUMI EMPLOYEES certifies that the documented hours are correct and authorizes TUMI,                to bill HOTEL for those hours. If a portion of any invoice is disputed HOTEL will pay the undisputed portion.</p>
                         
             <h4><strong>2.2. <a id="aToc524529523"></a>Delinquent Payments</strong></h4>
                         
             <p>Payment is due on receipt of invoice. Any invoice will be considered &ldquo;past due&rdquo; or delinquent if not                received by TUMI STAFFING within 15 days of the date on the invoice. Delinquent invoices will be subject to a                1.5% past-due penalty compounded monthly.</p>
                         
             <h4><strong>2.3. <a id="aToc524529524"></a>Premium Billable Hours</strong></h4>
                         
             <p>&ldquo;Premium Billable Hours&rdquo; shall be those hours of work performed by TUMI EMPLOYEES under this                Agreement and for the benefit of HOTEL which constitute overtime holiday or same day requests. TUMI EMPLOYEES                shall not work or incur Premium Billable Hours unless expressly directed, authorized, requested or otherwise                allowed by HOTEL. Premium Billable Hours will be billed by TUMI STAFFING to HOTEL at the same multiple of the                regular billing rate as TUMI STAFFING is required to apply to the TUMI EMPLOYEE&rsquo;s regular pay rate. (For                example, when a TUMI EMPLOYEE works in excess of 40 hours in a work week requiring 150% pay rate to that                employee HOTEL will be billed at 150% of the base rate for that position.)</p>
                         
             <h4><strong>2.4. <a id="aToc524529525"></a>Labor Costs</strong></h4>
                         
             <p>In addition to the billing rates specified in EXHIBIT A of this AGREEMENT, HOTEL will pay TUMI STAFFING the                amount of all new or increased labor costs associated with HOTELS assigned employees from TUMI STAFFING that                TUMI STAFFING is legally required to pay &ndash; such as wage increases, benefits, payroll taxes, social,                programs contributions or charges linked to benefit levels &ndash; until the parties agree on new billing                rates.</p>
                         
             <h3><strong>3. <a id="aToc225924513"></a><a id="aToc524529526"></a>Term &amp; Termination</strong></h3>
                         
             <h4><strong>3.1. <a id="aToc524529527"></a>Term</strong></h4>
                         
             <p><sup>This AGREEMENT shall remain in effect until and unless cancelled by either HOTEL or TUMI STAFFING. </sup></p>
                         
             <h4><strong>3.2. <a id="aToc524529528"></a>Rate Adjustments</strong></h4>
                         
             <p>Rates in EXHIBIT A will be adjusted at the beginning of each calendar year or more frequently as needed based                in fluctuations in prevailing wages and worker availability in the marketplace.</p>
                         
             <h4><strong>3.3. <a id="aToc524529529"></a>Termination</strong></h4>
                         
             <p>This Agreement may be terminated by either Party upon 30 days written notice to the other Party except that if                a Party becomes bankrupt or insolvent discontinues operations or fails to make any payments as required by                this Agreement, either Party may terminate the agreement upon 72 hours written notice. Under no circumstances                shall any termination of this Agreement affect, eliminate, or otherwise alter a Party&rsquo;s obligations to                pay any fees or amounts outstanding to the other Party as of the date of termination.</p>
                         
             <h3><strong>4. <a id="aToc225924514"></a><a id="aToc524529530"></a>INSURANCE OBLIGATIONS</strong></h3>
                         
             <h4><strong>4.1. <a id="aToc524529531"></a>Insurance by TUMI STAFFING</strong></h4>
                         
             <p>TUMI STAFFING will cover its operations for HOTEL with at least the following types and limits of insurance of                other coverage:</p>
                         
             <p>a) <span style="text-decoration: underline;">Commercial General Liability Insurance;</span> covering all                operations or activities arising out of or connected with this Agreement providing insurance for bodily                injury, property damage, personal injury, and contractual liability, with limits of not less than $ 1, 000, 000,                per occurrence and in the aggregate on $2, 000, 000.</p>
                         
             <p>b) <span style="text-decoration: underline;">Automobile Public Liability and Property Damage Insurance</span>                covering all vehicles owned leased operated or licensed by the Contractor with a combined single limit on                $1,000,000 for each incident for bodily injury, death or property damage.</p>
                         
             <p>c) <span style="text-decoration: underline;">Worker&rsquo;s compensation Insurance</span> as require by any                applicable law or regulation and in accordance with the laws of the state having jurisdiction over each                employee and employer&rsquo;s liability insurance in an amount of not less than $1,000,000 policy limit for                bodily injury by disease and $1,000,000 each employee for bodily injury by disease</p>
                         
             <p>d) <span style="text-decoration: underline;">Umbrella Liability Insurance</span> on an occurrence basis with a                minimum limit of at least $1,000,000 combined single limit for each occurrence in excess of the insurance                under policies indicated in Sections 1 (a), (b) and (c). Minimum limit of $2,000,000 may be met using a                combination of primary and umbrella/excess policies.</p>
                         
             <p>e) The insurance provided by TUMI STAFFING pursuant to the above shall be provided in accordance with the                following terms and conditions:</p>
                         
             <p>i. The policy referenced in 1(a) and (b) above, shall name the {LegalName} and their officers, directors,                employees, agents or servants as Additional insureds with respect to this Agreement;</p>
                         
             <p>ii. Each such policy shall contain a &ldquo;cross liability&rdquo; clause which shall have the effect of                insuring each person firm or corporation named in the policy as an insured in the same manner and to the same                extent as if a separate policy had been issued to each;</p>
                         
             <p>iii. Such policies shall be primary to and non-contributory with any insurance maintained by {namecompany} with                respect to such liabilities and shall grant a waiver of subrogation;</p>
                         
             <p>iv. Each such policy shall provide that a thirty (30) day written notice shall be given to {namecompany} prior                to any material change or cancellation of such policy; and</p>
                         
             <p>v. You will provide certificates of insurance to {namecompany} when this Agreement is signed and within a                reasonable time after such coverage is renewed or replace if the insurance certificates are not submitted                within seven (7) days from the date of this agreement or subsequent insurance renewal this Agreement maybe                cancelled at {namecompany}&rsquo;s option.</p>
                         
             <p>f) If TUMI STAFFING uses a contractor and/or a sub-contractor they will ensure that the contractors and/or                sub-contractors comply with the insurance provisions contained herein.</p>
                         
             <p>g) TUMI STAFFING agrees that the insurance coverages required to be maintained under the provisions of this                Agreement shall not limit or restrict its liabilities under this Agreement.</p>
                         
             <h3><strong>4.2. <a id="aToc524529532"></a>Insurance by HOTEL</strong></h3>
                         
             <p>HOTEL represents and warrants that Property is covered by a general liability insurance policy with limits of at                least $1,000,000.00 / $2,000,000.00. HOTEL further represents and warrants that it maintains commercial                automobile liability insurance on vehicles owned, leased, or rented by HOTEL (&ldquo;HOTEL Vehicles&rdquo;) and                which TUMI EMPLOYEES may operate in order to fulfill the duties set forth in this Agreement. Prior to any TUMI                EMPLOYEE operating any HOTEL Vehicle HOTEL will deliver to TUMI STAFFING documentation certifying such                insurance coverage further certifying that TUMI STAFFING is identified as an additional insured under such                policy.</p>
                         
             <h3><strong>5. <a id="aToc225924522"></a><a id="aToc524529533"></a>PROTECTIONS</strong></h3>
                         
             <h4><strong>5.1. <a id="aToc225924523"></a><a id="aToc524529534"></a>Non-Solicitation; Non-Circumvention. </strong></h4>
                         
             <p>a. HOTEL agrees that during the Term of this agreement and for a period of one year following the termination                of this agreement, HOTEL shall not knowingly solicit (other than general solicitations for employment) for                employment at the Hotel any employee of TUMI STAFFING. If such employee is hired to work at the Hotel prior to                such time period either directly or through a third party (UNAUTHORIZED EMPLOYMENT) HOTEL agrees to pay TUMI                STAFFING a fee of Five Thousand Dollars ($5,000). HOTEL however shall not be responsible to pay the fee if                HOTEL inadvertently hired an employee of TUMI STAFFING but terminates that employee within 48 hours of                receiving written notice from TUMI STAFFING of a violation of this provision.</p>
                         
             <p>b. Both parties agree that once an individual employee has completed Two Thousand and Eighty (2080) hours of                billable service under TUMI STAFFING the Hotel may request subject to the agreement of the employee to                convert that employee to a &ldquo;Direct Hire&rdquo; employee of the hotel. In such case upon the agreement of                the employee the Hotel agrees to pay a conversion fee of One Thousand Dollars ($1,000). Upon completion of the                payment of the conversion fee TUMI STAFFING will then release the employee to work as a Direct Hire of the                hotel. The employee will then be an employee of the hotel and all responsibilities for payment of wages                benefits and insurance will then belong to the HOTEL. TUMI STAFFING makes to warranties or guarantees that                the employee will then continue to work for the hotel for any minimum specified period of time and is not                liable should the employee quit abandon their job fail to perform or in any other way prove unsatisfactory as                an employee of the hotel.</p>
                         
             <p>c. For the Purposes of this agreement an EMPLOYEE of TUMI STAFFING is defined as any person hired by TUMI                STAFFING to work at HOTEL at any time during the term of this agreement without regard to the work status of                the EMPLOYEE with TUMI STAFFING at the time the UNAUTHORIZED EMPLOYMENT takes place.</p>
                         
             <p>&nbsp;</p>
                         
             <h3><strong>6. <a id="aToc524529535"></a>Confidential Information</strong></h3>
                         
             <p>For purposes of this Agreement &ldquo;Confidential Information&rdquo; means information or material of either                Party which is proprietary sensitive valuable or confidential to such Party which may be but is not                limited to network data, survey information, trade secret information, customer information, ideas, technical                information, scientific processes, business methods, product or business plans, marketing plans, proposals,                patent applications, forecasts, financial information, business records &ldquo;know-how&rdquo; or plans,                <strong><em>including the terms and conditions of this Agreement</em></strong>. <strong><span style="text-decoration: underline;">Exclusions:</span></strong>                Confidential Information does not include information and data which the receiving Party can show (a) was                publicly available at the time of disclosure or has become publicly available through no violation of this                Agreement by the receiving Party; (b) was validly in the receiving Partys possession prior to receipt thereof                from the disclosing Party; (c) was rightfully received by the receiving Party from a third party without                restriction and without breach of any agreement; or (d) was developed independently by the receiving Party                without any reference to Confidential Information received from Company.</p>
                         
             <h4><strong>6.1. <a id="aToc524529536"></a>Use of Confidential Information</strong></h4>
                         
             <p>Each Party may use the other Party&rsquo;s Confidential Information only for the purpose of performing his or                her obligations under this Agreement. Confidential Information shall be used for no other purpose. The                receiving Party (the Party receiving Confidential Information) agrees that it will not disclose the disclosing                Party&rsquo;s (the Party disclosing its Confidential Information) Confidential Information to any third party                without the disclosing Party&rsquo;s prior written consent. The receiving Party shall not be liable however                for any disclosure if the disclosure is required by law or order of court or governmental agency provided that                the receiving Party notify the disclosing Party sufficiently in advance of the required disclosure so that the                disclosing Party may act to protect the confidentiality of its information and provided that the receiving                Party assert the disclosing Party&rsquo;s claim of confidentiality in making the disclosure.</p>
                         
             <h4><strong>6.2. <a id="aToc524529537"></a>Non-Attribution</strong></h4>
                         
             <p>No knowledge, possession, or use of HOTEL&rsquo;s Confidential Information will be imputed or attributed to TUMI                STAFFING as a result of TUMI EMPLOYEES&rsquo; access or ability to access to HOTEL&rsquo;s Confidential                Information.</p>
                         
             <h3><strong>6.3. <a id="aToc225924524"></a><a id="aToc524529538"></a>Survivability; Specific Performance.</strong></h3>
                         
             <p>This Protections Section shall survive termination of this Agreement and shall extend for <strong>12 months</strong>                after such termination of this Agreement. Breach of the provisions of this Section may cause irreparable injury                to TUMI STAFFING for which monetary damages are inadequate difficult to compute or both. Accordingly the                provisions of this Section may be enforced by specific performance.</p>
                         
             <h3><strong>7. <a id="aToc225924526"></a><a id="aToc524529539"></a>INDEMNIFICATION</strong></h3>
                         
             <h4><strong>7.1. <a id="aToc524529540"></a>Duty to Indemnify; Procedure</strong></h4>
                         
             <p>Each Party (the &ldquo;Indemnifying Party&rdquo;) will defend, indemnify, and hold the other Party and its                parent, subsidiaries, directors, officers, agents, representatives, and employees (the &ldquo;Indemnified                Party&rdquo;) harmless from <sup>all claims, losses, and liabilities (including court costs and reasonable                    attorneys&rsquo; fees) to the extent caused by</sup> the Indemnifying Party&rsquo;s breach of this                Agreement; the Indemnifying Party&rsquo;s failure to discharge its duties and responsibilities set forth in                paragraph in this Agreement; or the negligence, gross negligence, or willful misconduct of the Indemnifying                Party or its officers, employees, or authorized agents in the discharge of those duties and responsibilities.                As a condition precedent to indemnification, the Indemnified Party will inform the Indemnifying Party in                writing within 10 business days after it receives notice of any claim, loss, liability, or demand for which it                seeks indemnification under this Agreement. Each Party agrees to cooperate and to provide reasonable assistance                to the other Party in the investigation and resolution of any complaints, claims, actions, or proceedings that                may be brought by or that may involve Tumi Employees or otherwise arises under this Agreement.</p>
                         
             <h4><strong>7.2. <a id="aToc524529541"></a>Disclaimer of Consequential and Special Damages</strong></h4>
                         
             <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW NEITHER PARTY NOR ANY RELATED ENTITY THEREOF SHALL BE LIABLE UNDER THIS                AGREEMENT TO THE OTHER PARTY ANY RELATED ENTITY THEREOF OR ANY OTHER THIRD PERSON FOR ANY INDIRECT                INCIDENTAL, CONSEQUENTIAL, SPECIAL, RELIANCE, OR PUNITIVE DAMAGES OR FOR LOST OR IMPUTED PROFITS, LOST DATA, OR                COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES WHETHER LIABILITY IS ASSERTED IN CONTRACT TORT (INCLUDING                NEGLIGENCE AND STRICT PRODUCT LIABILITY), INDEMNITY OR CONTRIBUTION AND IRRESPECTIVE OF WHETHER A PARTY OR                ANY RELATED ENTITY HAS BEEN ADVISED OF THE POSSIBILITY OF ANY SUCH LOSS OR DAMAGE.</p>
                         
             <h3><strong>8. <a id="aToc524529542"></a>No Guaranties</strong></h3>
                         
             <p>TUMI STAFFING does not guaranty any performance result by TUMI EMPLOYEES. TUMI STAFFING further does not                guarantee the credentials or expertise of any TUMI EMPLOYEE supplied by TUMI STAFFING. TUMI STAFFING does not                provide and hereby disclaims any express or implied warranties.</p>
                         
             <h3><strong>9. <a id="aToc225924527"></a><a id="aToc524529543"></a>MISCELLANEOUS</strong></h3>
                         
             <p><strong>A.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Definitions.</strong>                All capitalized terms shall have the definitions set forth herein.</p>
                         
             <p><strong>B.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Survivability.                </strong>Provisions of this Agreement which by their terms extend beyond the termination or non-renewal of                this Agreement will remain effective after termination or non-renewal.</p>
                         
             <p><strong>C.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amendment.</strong>                No provision of this Agreement may be amended or waived unless agreed to in writing and signed by both Parties.</p>
                         
             <p><strong>D.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Severability.</strong>                Should any provision of this Agreement for any reason be declared invalid or unenforceable by final order of                any court or regulatory body having jurisdiction, such decision shall not affect the validity of the remaining                portions and the remaining portions shall remain in full force and effect as if this Agreement had been                executed without the invalid portion.</p>
                         
             <p><strong>E.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Merger. </strong>This                Agreement and any attached Exhibits contain the entire understanding between the Parties and supersede all                prior agreements and understandings relating to the subject matter contained therein.</p>
                         
             <p><strong>F.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Binding.</strong>                The provisions of this Agreement will inure to the benefit of and be binding on the parties and their                respective representatives, successors, and assigns.</p>
                         
             <p><strong>G.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Waiver.</strong>                The failure of a Party to enforce the provisions of this Agreement will not be a waiver of any provision or the                right of such Party thereafter to enforce each and every provision of this Agreement.</p>
                         
             <p><strong>H.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assignment.</strong>                HOTEL&rsquo;s duties under this Agreement are not assignable nor in any way transferrable without the prior                written consent of TUMI STAFFING nor may HOTEL transfer or assign this Agreement without TUMI STAFFING&rsquo;s                prior written consent.</p>
                         
             <p><strong>I.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Notice.</strong>                Any notice or other communication will be deemed to be properly given only when sent via the United States                Postal Service or a nationally recognized courier addressed as shown in the first page of this AGREEMENT.</p>
                         
             <p><strong>J.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Force Majeure.</strong>                Neither Party will be responsible for failure or delay in performance of this Agreement if the failure or delay                is due to labor disputes, strikes, fire, riot, war, terrorism, acts of God, or any other cause beyond the                control of the nonperforming Party.</p>
                         
             <p><strong>K.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Authorization.                </strong>The signatories to this Agreement represent and warrant they have the authority, permission and                ability to bind their respective parties.</p>
                         
             <p>&nbsp;</p>
                         
             <p><strong>Execution by the Parties</strong></p>
                         
             <p>Authorized representative of the parties have executed this AGREEMENT below to express the parties&rsquo;                agreement to its terms.</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <p>&nbsp;</p>
                         
             <table style="height: 17px; width: 100%; border-collapse: collapse;" border="0">
                                
                <tbody>
                                       
                   <tr style="height: 17px;">
                                              
                      <td style="width: 50%; height: 17px;">
                                                     
                         <p><strong>HOTEL</strong></p>
                                                     
                         <p><strong>{namecompany}</strong></p>
                                                     
                         <p>&nbsp;</p>
                                                     
                         <p>By: <span style="text-decoration: underline;">{signatureclient}</span></p>
                                                     
                         <p>Name: <span style="text-decoration: underline;">{nameclient}</span></p>
                                                     
                         <p>Title: <span style="text-decoration: underline;">{titleclient}</span></p>
                                                     
                         <p>Date: <span style="text-decoration: underline;">{datesignatureclient}</span></p>
                                                 
                      </td>
                                              
                      <td style="width: 50%; height: 17px;">
                                                     
                         <p><strong>TUMI STAFFING INC.</strong></p>
                                                     
                         <p>&nbsp;</p>
                                                     
                         <p>&nbsp;</p>
                                                     
                         <p>By: <span style="text-decoration: underline;">{signatureemploye}</span></p>
                                                     
                         <p>Name: <span style="text-decoration: underline;">{nameemploye}</span></p>
                                                     
                         <p>Title: <span style="text-decoration: underline;">{titleemploye}</span></p>
                                                     
                         <p>Date: <span style="text-decoration: underline;">{signatureemployedate}</span></p>
                                                 
                      </td>
                                          
                   </tr>
                                   
                </tbody>
                            
             </table>
                         
             <p>&nbsp;</p>
                         
             <h3><strong><span style="text-decoration: underline;"><a id="aToc524529544"></a>EXHIBIT A<br /></span>Rate Schedule</strong></h3>
                         
             <p>&nbsp;</p>
                         
             <h3><strong><span style="text-decoration: underline;"><a id="aToc225924529"></a><a id="aToc524529545"></a>EXHIBIT B<br /></span>Benefits                    Waiver</strong></h3>
                         
             <p>&nbsp;</p>
                         
             <h3><strong><span style="text-decoration: underline;"><a id="aToc225924530"></a><a id="aToc524529546"></a>EXHIBIT C<br /></span>Staff                    Confidentiality Agreement</strong></h3>
                         
             <p>&nbsp;</p>
                         
             <h3><strong><span style="text-decoration: underline;"><a id="aToc225924531"></a><a id="aToc524529547"></a>EXHIBIT D<br /></span>Job                    Descriptions</strong></h3>
                         
             <span style="display:block; margin-top:400px">
                                
                <h3 style="text-align: center;">&nbsp;</h3>
                                
                <h3 style="text-align: center;">Exhibit A</h3>
                                
                <h3 style="text-align: center;">Rate Schedule</h3>
                                
                <p>For:</p>
                                
                <p>{namecompany}</p>
                                
                <p>{directioncompany}</p>
                                
                <p>The following rate schedule is applicable for the calendar year {Year}:</p>
                                
                <p><strong>&nbsp;</strong></p>
                                {ExhibitA}                
                <p>&nbsp;</p>
                                
                <p>Rates are effective until {ExpirationDate}.</p>
                                
                <p>&nbsp;</p>
                                
                <p>Work week will be defined as the 7 day period beginning {Weeksday}. Rates are based on regular time (0                    &ndash;                    40 hours) per work week.</p>
                                
                <p>Same day requests are an additional $1.00 per hour regardless of position.</p>
                                
                <p>Overtime rates (Over 40 hours per work week) are 1.5 times regular rate.</p>
                                
                <p>Holiday rates are 1.5 times regular rate. Applicable Holidays are: New Year&rsquo;s Day, Memorial Day, July                    4,                    Labor Day, Thanksgiving Day and Christmas Day</p>
                                
                <p>&nbsp;</p>
                                
                <p>&nbsp;</p>
                            
             </span>
                         
             <span style="display:block; margin-top:400px">
                                
                <h3 style="text-align: center;">Exhibit B</h3>
                                
                <h3 style="text-align: center;">Benefits Waiver</h3>
                                
                <p>In consideration of my assignment to the {namecompany} by TUMI STAFFING Inc. I agree that I am solely an                    employee of TUMI STAFFING INC for benefits plan purposes and that I am eligible only for such benefits as                    TUMI                    STAFFING may offer to me as its employee.</p>
                                
                <p>I further understand and agree that I am not eligible for or entitled to participate in or make any claim                    upon                    any benefit plan, policy or practice offered by the {namecompany}, its parents, affiliates, subsidiaries                    or                    successors to any of their direct employees regardless of the length of my assignment to the {namecompany}                    by                    TUMI STAFFING and regardless of whether I am held to be a common-law employee of the {namecompany} for any                    purpose; and therefore with full knowledge and understanding, I hereby expressly waive any claim or right                    that                    I may have now or in the future to such benefits and agree not to make any claim for such benefits.</p>
                                
                <table style="width: 100%; border-collapse: collapse;" border="0">
                                       
                   <tbody>
                                              
                      <tr>
                                                     
                         <td style="width: 718px;">
                                                            
                            <p>TUMI STAFFING EMPLOYEE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                            
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{signatureemploye}</span></p>
                                                            
                            <p>Signature</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{nameemploye}</span></p>
                                                            
                            <p>Printed Name</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{signatureemployedate}</span></p>
                                                            
                            <p>Date</p>
                                                        
                         </td>
                                                     
                         <td style="width: 717.2px;">
                            &nbsp;                                
                            <p>WITNESS</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Signature</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Printed Name</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Date</p>
                                                        
                         </td>
                                                 
                      </tr>
                                          
                   </tbody>
                                   
                </table>
                                
                <p>&nbsp;</p>
                            
             </span>
                         
             <span style="display:block; margin-top:400px">
                                
                <h3 style="text-align: center;">Exhibit C</h3>
                                
                <h3 style="text-align: center;">Confidentiality Agreement</h3>
                                
                <p>&nbsp;</p>
                                
                <h4>TUMI STAFFING CONFIDENTIALITY AGREEMENT</h4>
                                
                <p>As a condition of my assignment by Tumi Staffing Inc. to any Client, I hereby agree as follows:</p>
                                
                <p>I will not use disclose or in any way reveal or disseminate to unauthorized parties any information I gain                    through contact with materials or documents that are made available through my assignment at CLIENT or                    which I                    learn about during such assignment.</p>
                                
                <p>I will not disclose or in any way reveal or disseminate any information pertaining to CLIENT or its                    operating                    methods and procedures that come to my attention as a result of this assignment.</p>
                                
                <p>Under no circumstances will I remove physical or electronic documents or copies of documents from the                    premises                    of CLIENT.</p>
                                
                <p>I understand that I will be responsible for any direct or consequential damages resulting from any violation                    of                    the agreement.</p>
                                
                <p>The obligations of this agreement will survive my employment by TUMI STAFFING INC.</p>
                                
                <table style="width: 100%; border-collapse: collapse;" border="0">
                                       
                   <tbody>
                                              
                      <tr>
                                                     
                         <td style="width: 718px;">
                                                            
                            <p>TUMI STAFFING EMPLOYEE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                            
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{signatureemploye}</span></p>
                                                            
                            <p>Signature</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{nameemploye}</span></p>
                                                            
                            <p>Printed Name</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p><span style="text-decoration: underline;">{signatureemployedate}</span></p>
                                                            
                            <p>Date</p>
                                                        
                         </td>
                                                     
                         <td style="width: 717.2px;">
                            &nbsp;                                
                            <p>WITNESS</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Signature</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Printed Name</p>
                                                            
                            <p>&nbsp;</p>
                                                            
                            <p>______________________________________</p>
                                                            
                            <p>Date</p>
                                                        
                         </td>
                                                 
                      </tr>
                                          
                   </tbody>
                                   
                </table>
                                
                <p>&nbsp;</p>
                            
             </span>
                         
             <span style="display:block; margin-top:400px">
                                
                <h3 style="text-align: center;">Exhibit D</h3>
                                
                <h3 style="text-align: center;">Job Descriptions</h3>
                                
                <p><strong>{namecompany}</strong></p>
                                
                <p><strong>{directioncompany}</strong></p>
                                
                <p>&nbsp;</p>
                                
                <p><strong>{namecompany} </strong>will provide Job Descriptions which will be incorporated as part of EXHIIBT                    D                    for the following positions:</p>
                                
                <p>&nbsp;</p>
                                
                <table style="width: 100%; border-collapse: collapse;" border="2">
                                       
                   <tbody>
                                              
                      <tr style="background-color: #ddd9c3;">
                                                     
                         <td style="width: 4.76187%;">No</td>
                                                     
                         <td style="width: 38.0489%;">DEPARTMENT</td>
                                                     
                         <td style="width: 57.1891%;">POSITION</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">1</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">2</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">3</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">4</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">5</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">6</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">7</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">8</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">9</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                              
                      <tr>
                                                     
                         <td style="width: 4.76187%;">10</td>
                                                     
                         <td style="width: 38.0489%;">&nbsp;</td>
                                                     
                         <td style="width: 57.1891%;">&nbsp;</td>
                                                 
                      </tr>
                                          
                   </tbody>
                                   
                </table>
                                
                <p>&nbsp;</p>
                            
             </span>
                     
          </span>
          
       </body>
       
    </html>`
}

const generateContractTerms = (contract, businessCompany, supervisor, posRate) => {
   let currentTime = moment(new Date());
   let { Start_Week, End_Week} = businessCompany;
   let {Contract_Expiration_Date, Contract_Start_Date} = contract;
   let starDay = moment().isoWeekday(Start_Week || 0).format('dddd'), endDay = moment().isoWeekday(End_Week || 0).format('dddd');
   
   return contractTemplate()
         .replace(/{namecompany}/gi,contract.Contract_Name)
         .replace(/{directioncompany}/gi,[businessCompany.Location, businessCompany.City, businessCompany.State].join() )
         .replace(/{Today}/gi, currentTime.format('MM/DD/YYYY'))
         .replace(/{Year}/gi, currentTime.format('YYYY')) // moment().isoWeekday(7).format('dddd')
         .replace(/{Weeksday}/gi,[starDay, endDay].join(' through '))
         .replace(/{ExpirationDate}/gi, Contract_Expiration_Date ? moment(Contract_Expiration_Date).format('MM/DD/YYYY') : '')
         .replace(/{LegalName}/gi,contract.legalName)
         .replace(/{ContractStartDate}/gi,Contract_Start_Date ? moment(Contract_Start_Date).format('MM/DD/YYYY') : '')
         .replace(/{nameclient}/gi, supervisor.Full_Name)
         .replace(/{titleclient}/gi, contract.User_Signed_Title)
         .replace(/{nameemploye}/gi, 'Stephen A. Robbins')
         .replace(/{titleemploye}/gi, 'President')
         .replace(/{ExhibitA}/gi,
            [`
               <table style="height: auto; width: 100%;" border="2" rules="all">
                  <tbody>
                     <tr style="height: 45px; background-color: #ddd9c3;">
                        <td style="height: 45px; width: 107.6px;"><p><strong>DEPARTMENT</strong></p></td>
                        <td style="height: 45px; width: 286px;"><p><strong>POSITION</strong></p></td>
                        <td style="height: 45px; width: 48.4px; text-align: center;"><p><strong>SHIFT</strong></p></td>
                        <td style="height: 45px; width: 95.6px; text-align: center;"><p><strong>${currentTime.format('YYYY')} RATES</strong></p></td>
                     </tr> 
               `,
               posRate.map(pr => {
                  let shift;

                  switch (pr.Shift) {
                     case 'A':
                        shift = '1st';
                        break;
                     case 'P':
                        shift = '2nd';
                        break;
                     default:
                        shift = '3rd';
                        break;
                  }

                  return `
                  <tr style="height: auto">
                     <td style="padding-left:5px; height: 30px; width: 107.6px; vertical-align: top;"><p>${pr.DisplayLabel ? pr.DisplayLabel.trim() : ''}</p></td>
                     <td style="padding-left:5px; height: 30px; width: 286px; vertical-align: top;"><p>${pr.Position ? pr.Position.trim() : ''}</p></td>
                     <td style="text-align:center; height: 30px; width: 48.4px; vertical-align: top;"><p>${shift}</p></td>
                     <td style="text-align:center; height: 30px; width: 95.6px; vertical-align: top;"><p>${pr.Bill_Rate}</p></td>
                  </tr>`
               }),
               '</tbody></table>'
            ].join('')
         )
}

const generatePdfFile = (html, srcFile) => {
   return new Promise((resolve, reject) => {
      var options = {
         format: 'Letter',
         font: 'Arial',
         size: 12,
         type: "pdf",             // allowed file types: png, jpeg, pdf
         quality: "75",           // only used for types png & jpeg
         orientation: 'portrait',
         zoomFactor: 1,
         border: {
            top: '0.98in', // default is 0, units: mm, cm, in, px
            right: '0.98in',
            bottom: '0.98in',
            left: '0.98in'
         }
      };
      pdf.create(html, options).toFile(srcFile, function (err, res) {
         if (err) return console.log(err);
         resolve(res);
      });
   });
}

const uploadToS3 = (filePath) => {
   return new Promise((resolve, reject) => {
      try {
         var s3 = new AWS.S3({
            accessKeyId: 'AKIAZTTPXWUZ6OPRW2P6',
            secretAccessKey: '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',
            region: 'us-east-1'
         });
         
         // return
         var params = {
            Bucket: 'orion1-files',
            Body : fs.createReadStream(filePath),
            ACL: 'public-read',
            Key : 'contracts/' + filePath.replace('./public/', '')
         };

         s3.upload(params, function (err, data) {
            //handle error
            if (err) {
               console.log("Error", err);
               resolve(null);
            }
            //success
            if (data) {
               resolve(data);
            }
         });
      } catch (error) {
         resolve(null);
      }
      
   })
}

const ContractMutation = {
    addContract: {
        type: ContractType,
        description: 'Add contract to database',
        args: {
            contract: { type: inputInsertContracts }
        },
        resolve(source, args) {
           let {contract} = args;
           let entityId = contract.Id_Entity || contract.IdManagement;
           return Db.models.BusinessCompany.findOne({
              where: {
                 Id: entityId
               },
               include: [{
                  model: Db.models.PositionRate,
                  include: [{
                     model: Db.models.CatalogItem,
                     as: 'Department'
                  }],
                  required: false
               }]
            })
            .then(busCompany => {
               let posRate = busCompany.dataValues.PositionRates.map(p => {
                  let dispLabel = p.dataValues.Department.dataValues.DisplayLabel;
                  return {
                     DisplayLabel: dispLabel ? dispLabel.trim() : '',
                     Position: p.Position ? p.Position : '',
                     Shift: p.Shift,
                     Bill_Rate: p.Bill_Rate
                  }
               });
               
               let srcFile = '';

               return Db.models.Contacts.findOne({ 
                  where: { Id_Entity: entityId }
               }).then(ret => {
                  let {First_Name, Middle_Name, Last_Name} = ret.dataValues;
                  let fullName = [
                     First_Name ? First_Name.trim() : '',
                     Middle_Name ? Middle_Name.trim() : '',
                     Last_Name ? Last_Name.trim() : ''
                  ].join(' ');
                  
                  let html = generateContractTerms(contract, busCompany, {Full_Name: fullName}, posRate);

                  
                  var filename = `${contract.Contract_Name}`;
                  srcFile = `./public/${filename}.pdf`;

                  const pdfPromise = generatePdfFile(html, srcFile);
                  return pdfPromise.then(() => {
                     //aqui va la logica de S3
                     return uploadToS3(srcFile).then((data) =>{
                        let url = data.Location;
                        contract.Contract_Terms = url;
                        return Db.models.Contracts.create(contract, { returning: true }).then(async ret => {
                           let contractExpDate = contract.Contract_Expiration_Date ? moment(contract.Contract_Expiration_Date).format('MM/DD/YYYY') : '';
                           let newToken = [{
                              Token: Math.floor(Math.random() * 90000) + 10000,
                              IsActive: 1,
                              Id_Contract: ret ? ret.dataValues.Id : 0,
                              Signatory: 'C'
                           },
                           {
                              Token: Math.floor(Math.random() * 90000) + 10000,
                              IsActive: 1,
                              Id_Contract: ret ? ret.dataValues.Id : 0,
                              Signatory: 'E'
                           }];
                           await Db.models.Token.bulkCreate(newToken, { returning: true })
                           await Db.models.BusinessCompany.update({Contract_Expiration_Date: contractExpDate} ,{ where: {Id: entityId}}, { returning: true });
                           
                           return ret.dataValues;
                        });
                     });

                  });

               }).catch(() => {
                  return null
               });
               
            });
        }
    },
    updateContract: {
        type: ContractType,
        description: 'Update Contract Record',
        args: {
            contract: { type: inputUpdateContracts }
        },
        resolve(source, args) {
         let {contract} = args;
         let entityId = contract.Id_Entity || contract.IdManagement;
         return Db.models.BusinessCompany.findOne({
            where: {
               Id: entityId
             },
             include: [{
                model: Db.models.PositionRate,
                include: [{
                   model: Db.models.CatalogItem,
                   as: 'Department'
                }],
                required: false
             }]
          })
          .then(busCompany => {
             let dispLabel;
             let posRate = busCompany.dataValues.PositionRates.map(p => {
                dispLabel = p.dataValues.Department.dataValues.DisplayLabel;
                return {
                   DisplayLabel: dispLabel ? dispLabel.trim() : '',
                   Position: p.Position ? p.Position : '',
                   Shift: p.Shift,
                   Bill_Rate: p.Bill_Rate
                }
             });
             
             let srcFile = '';

             return Db.models.Contacts.findOne({ 
                where: { Id_Entity: entityId }
             }).then(ret => {
                let {First_Name, Middle_Name, Last_Name} = ret.dataValues;
                let fullName = [
                   First_Name ? First_Name.trim() : '',
                   Middle_Name ? Middle_Name.trim() : '',
                   Last_Name ? Last_Name.trim() : ''
                ].join(' ');
                
                let html = generateContractTerms(contract, busCompany, {Full_Name: fullName}, posRate);

                
                var filename = `${contract.Contract_Name}`;
                srcFile = `./public/${filename}.pdf`;

                const pdfPromise = generatePdfFile(html, srcFile);
                return pdfPromise.then(() => {
                   //aqui va la logica de S3
                   return uploadToS3(srcFile).then((data) =>{
                      let url = data.Location;
                      contract.Contract_Terms = url;
                      return Db.models.Contracts.update(contract, {
                              where: {
                                 Id: contract.Id
                              },
                              returning: true
                           }).then(function ([rowsUpdate, [record]]) {
                           if (record) return record.dataValues;
                           else return null;
                        });
                   });
                
                });

             }).catch(() => {
                return null
             });
             
          });
        }
    }
};

export default ContractMutation;
