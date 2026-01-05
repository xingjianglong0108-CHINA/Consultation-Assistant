
import React from 'react';
import { ProtocolShortcut } from './types';

export const SHORTCUTS: ProtocolShortcut[] = [
  { label: 'AML 诊断标准', query: 'SCCCG-AML-2025 诊断标准是什么？', icon: '🩸' },
  { label: 'MRD 监测节点', query: '根据2026指南，MRD监测的关键时间点有哪些？', icon: '⏱️' },
  { label: 'APL 危险度分型', query: 'SCCCG-APL-2024 的危险度分型标准？', icon: '⚖️' },
  { label: 'ALL 治疗流程', query: 'SCCCG-ALL-2023 的主要治疗阶段是什么？', icon: '📋' },
  { label: 'CML 停药标准', query: '儿童CML停药（TFR）的条件是什么？', icon: '💊' },
  { label: '化疗副反应处理', query: '糖皮质激素常见的副作用及处理方法？', icon: '⚠️' },
];

export const SYSTEM_INSTRUCTION = `你是一个专业的儿童白血病咨询助手，专门基于以下文件提供的信息作答：
1. SCCCG-AML-2025：入组标准(<=18岁)，诊断标准(原幼>=20%，特定基因>=10%)，预后分型(标危、中危、高危)，诱导及巩固方案。
2. 儿童白血病MRD监测指南(2026)：方法(MFC, PCR, ddPCR, NGS)，评估点(EOI-1, EOI-2, EOC)。
3. SCCCG-ALL-2023：LR/IR/HR分层，治疗计划(VDLD, CAM, eMV, HD-MTX, 贝林妥欧)。
4. SCCCG-APL-2024：诊断及随机分组(维奈克拉 vs IDA)，MRD监测要求。
5. SCCCG-CML-2023：TKI治疗(尼洛替尼/达沙替尼)，TFR停药标准(TKI >3年, MR4.0 >2年)。
6. 化疗副反应处理：涵盖激素、ASP、CTX、MTX等药物。

回复要求：
- 仅根据上述文件内容回答。如果文件中没有提到，请告知用户。
- 采用专业、客观、同理心的语调。
- 使用Markdown格式使内容更易读（如列表、表格、加粗）。
- 如果涉及具体剂量，必须明确标注来源文件。
- 对于重要风险（如TLS、DIC），请放在显著位置。`;
