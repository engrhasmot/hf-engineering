import dbConnect from "@/lib/db";
import CEPSettings from "@/models/cost-estimator-pro/cep-settings.model";
import CEPMaterialRate from "@/models/cost-estimator-pro/cep-material-rate.model";
import CEPLabourRate from "@/models/cost-estimator-pro/cep-labour-rate.model";
import CEPLocation from "@/models/cost-estimator-pro/cep-location.model";
import CEPBOQTemplate from "@/models/cost-estimator-pro/cep-boq-template.model";

export async function ensureCEPDefaults() {
  await dbConnect();

  // 1. Settings
  const settingsCount = await CEPSettings.countDocuments();
  if (settingsCount === 0) {
    await CEPSettings.create({});
  }

  // 2. Locations
  const locationCount = await CEPLocation.countDocuments();
  if (locationCount === 0) {
    await CEPLocation.insertMany([
      { code: "DHK", name: "Dhaka Metro", parentRegion: "Dhaka Division", costMultiplier: 1.0, isActive: true },
      { code: "SVR", name: "Savar & Ashulia", parentRegion: "Dhaka Division", costMultiplier: 0.98, isActive: true },
      { code: "GZP", name: "Gazipur", parentRegion: "Dhaka Division", costMultiplier: 0.99, isActive: true },
      { code: "NRG", name: "Narayanganj", parentRegion: "Dhaka Division", costMultiplier: 1.0, isActive: true },
      { code: "CTG", name: "Chattogram Metro", parentRegion: "Chattogram Division", costMultiplier: 1.02, isActive: true },
      { code: "SYL", name: "Sylhet", parentRegion: "Sylhet Division", costMultiplier: 0.96, isActive: true },
      { code: "OTHER", name: "Other Districts", parentRegion: "Bangladesh", costMultiplier: 0.95, isActive: true },
    ]);
  }

  // 3. Materials
  const materialCount = await CEPMaterialRate.countDocuments();
  if (materialCount === 0) {
    await CEPMaterialRate.insertMany([
      { code: "MAT-CEM-01", name: "Portland Composite Cement (PCC)", category: "Cement", unit: "bag", unitPrice: 535, location: "All" },
      { code: "MAT-CEM-02", name: "Ordinary Portland Cement (OPC)", category: "Cement", unit: "bag", unitPrice: 565, location: "All" },
      { code: "MAT-STL-01", name: "500W TMT Deformed Rebar (60/72 Grade)", category: "Reinforcement Steel", unit: "ton", unitPrice: 96000, location: "All" },
      { code: "MAT-SND-01", name: "Sylhet Coarse Sand (FM 2.5)", category: "Sand", unit: "cft", unitPrice: 65, location: "All" },
      { code: "MAT-SND-02", name: "Local Medium Sand (FM 1.5)", category: "Sand", unit: "cft", unitPrice: 32, location: "All" },
      { code: "MAT-BRK-01", name: "1st Class Auto Gas Bricks", category: "Bricks & Blocks", unit: "piece", unitPrice: 14.5, location: "All" },
      { code: "MAT-BRK-02", name: "Solid Concrete Blocks (4x8x16)", category: "Bricks & Blocks", unit: "piece", unitPrice: 52, location: "All" },
      { code: "MAT-STN-01", name: "Bholaganj / Crushed Stone Chips (3/4\")", category: "Aggregates & Stone Chips", unit: "cft", unitPrice: 215, location: "All" },
      { code: "MAT-TIL-01", name: "Homogeneous Floor Tiles (24x24)", category: "Tiles & Stones", unit: "sft", unitPrice: 95, location: "All" },
      { code: "MAT-TIL-02", name: "Glazed Ceramic Wall Tiles (12x18)", category: "Tiles & Stones", unit: "sft", unitPrice: 68, location: "All" },
      { code: "MAT-PNT-01", name: "Exterior Weather Coat Paint", category: "Paints & Finishes", unit: "litre", unitPrice: 480, location: "All" },
      { code: "MAT-PNT-02", name: "Interior Luxury Silk Emulsion", category: "Paints & Finishes", unit: "litre", unitPrice: 380, location: "All" },
      { code: "MAT-FRM-01", name: "Steel Props & Marine Shuttering Sheet", category: "Formwork & Timber", unit: "sft", unitPrice: 45, location: "All" },
      { code: "MAT-WTR-01", name: "Crystalline Waterproofing Compound", category: "Waterproofing & Chemicals", unit: "kg", unitPrice: 195, location: "All" },
      { code: "MAT-ELE-01", name: "BRB/BBS 2.5 RM FR Cable & Fittings", category: "Electrical", unit: "sft", unitPrice: 65, location: "All" },
      { code: "MAT-PLM-01", name: "UPVC / CPVC Pipe & Sanitary Fixtures", category: "Plumbing & Sanitary", unit: "sft", unitPrice: 60, location: "All" },
    ]);
  }

  // 4. Labour
  const labourCount = await CEPLabourRate.countDocuments();
  if (labourCount === 0) {
    await CEPLabourRate.insertMany([
      { code: "LAB-MAS-01", tradeName: "Head Mason (Rajmistri)", category: "Head Mason (Rajmistri)", unit: "day", rate: 1100, location: "All" },
      { code: "LAB-MAS-02", tradeName: "Assistant Mason", category: "Assistant Mason", unit: "day", rate: 950, location: "All" },
      { code: "LAB-ROD-01", tradeName: "Steel Fixer / Rod Binder", category: "Rod Binder (Steel Fixer)", unit: "day", rate: 950, location: "All" },
      { code: "LAB-CAR-01", tradeName: "Shuttering Carpenter", category: "Shuttering Carpenter", unit: "day", rate: 1000, location: "All" },
      { code: "LAB-TIL-01", tradeName: "Tile & Marble Specialist", category: "Tile & Marble Specialist", unit: "day", rate: 1050, location: "All" },
      { code: "LAB-PNT-01", tradeName: "Master Painter", category: "Painter", unit: "day", rate: 900, location: "All" },
      { code: "LAB-ELE-01", tradeName: "Electrician", category: "Electrician", unit: "day", rate: 1000, location: "All" },
      { code: "LAB-PLM-01", tradeName: "Plumber & Pipe Fitter", category: "Plumber & Pipe Fitter", unit: "day", rate: 1000, location: "All" },
      { code: "LAB-EXC-01", tradeName: "Excavation Labourer", category: "Excavator & Earthwork Labour", unit: "day", rate: 750, location: "All" },
      { code: "LAB-HLP-01", tradeName: "General Helper", category: "General Construction Helper", unit: "day", rate: 750, location: "All" },
    ]);
  }

  // 5. Default BOQ Template
  const templateCount = await CEPBOQTemplate.countDocuments();
  if (templateCount === 0) {
    await CEPBOQTemplate.create({
      code: "BOQ-STD-RES",
      name: "Standard Multi-Storey Residential Building BOQ",
      description: "Comprehensive BNBC 2020 standard BOQ template for 4 to 8 storied residential buildings",
      buildingType: "Residential",
      foundationType: "Isolated Footing",
      isDefault: true,
      isActive: true,
      version: "1.0",
      items: [
        {
          itemCode: "EW-001",
          category: "Site & Earthwork",
          description: "Earth excavation in foundation trenches including stacking and backfilling",
          unit: "cft",
          quantityFormula: "avgFloorArea * 1.8 * foundationFactor",
          defaultUnitRate: 14.5,
          materialComponents: [],
          labourComponents: [{ tradeCode: "LAB-EXC-01", manDaysPerUnit: 0.015 }],
          order: 1,
          isActive: true,
        },
        {
          itemCode: "RCC-002",
          category: "Superstructure RCC",
          description: "RCC (1:1.5:3) in columns, beams, lintels and slabs with stone chips & 500W rebar",
          unit: "cft",
          quantityFormula: "totalBuiltUpArea * 0.16",
          defaultUnitRate: 385,
          materialComponents: [
            { materialCode: "MAT-CEM-01", ratioOrFactor: 0.245, unit: "bag" },
            { materialCode: "MAT-SND-01", ratioOrFactor: 0.44, unit: "cft" },
            { materialCode: "MAT-STN-01", ratioOrFactor: 0.88, unit: "cft" },
          ],
          labourComponents: [
            { tradeCode: "LAB-MAS-01", manDaysPerUnit: 0.04 },
            { tradeCode: "LAB-HLP-01", manDaysPerUnit: 0.08 },
          ],
          order: 2,
          isActive: true,
        },
        {
          itemCode: "STL-001",
          category: "Reinforcement Steel",
          description: "500W deformed rebar bending, fabrication and tying in RCC members",
          unit: "ton",
          quantityFormula: "(totalBuiltUpArea * 4.2) / 1000",
          defaultUnitRate: 104500,
          materialComponents: [{ materialCode: "MAT-STL-01", ratioOrFactor: 1.0, unit: "ton" }],
          labourComponents: [{ tradeCode: "LAB-ROD-01", manDaysPerUnit: 8.5 }],
          order: 3,
          isActive: true,
        },
        {
          itemCode: "MAS-001",
          category: "Masonry & Plaster",
          description: "125mm (5-inch) auto brick wall masonry in cement mortar (1:4)",
          unit: "sft",
          quantityFormula: "totalBuiltUpArea * 0.95",
          defaultUnitRate: 122,
          materialComponents: [
            { materialCode: "MAT-BRK-01", ratioOrFactor: 4.8, unit: "piece" },
            { materialCode: "MAT-CEM-01", ratioOrFactor: 0.0125, unit: "bag" },
            { materialCode: "MAT-SND-02", ratioOrFactor: 0.065, unit: "cft" },
          ],
          labourComponents: [{ tradeCode: "LAB-MAS-02", manDaysPerUnit: 0.035 }],
          order: 4,
          isActive: true,
        },
      ],
    });
  }
}
