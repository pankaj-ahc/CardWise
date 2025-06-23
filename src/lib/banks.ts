export interface BankInfo {
  name: string;
  logo: string;
}

export const popularBanks: BankInfo[] = [
  // US & North America
  { name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com' },
  { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { name: 'Bank of Montreal (BMO)', logo: 'https://logo.clearbit.com/bmo.com' },
  { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com' },
  { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
  { name: 'CIBC', logo: 'https://logo.clearbit.com/cibc.com' },
  { name: 'Citibank', logo: 'https://logo.clearbit.com/citi.com' },
  { name: 'Discover', logo: 'https://logo.clearbit.com/discover.com' },
  { name: 'Goldman Sachs', logo: 'https://logo.clearbit.com/gs.com' },
  { name: 'Morgan Stanley', logo: 'https://logo.clearbit.com/morganstanley.com' },
  { name: 'PNC Bank', logo: 'https://logo.clearbit.com/pnc.com' },
  { name: 'Royal Bank of Canada (RBC)', logo: 'https://logo.clearbit.com/rbc.com' },
  { name: 'Scotiabank', logo: 'https://logo.clearbit.com/scotiabank.com' },
  { name: 'TD Bank', logo: 'https://logo.clearbit.com/td.com' },
  { name: 'U.S. Bank', logo: 'https://logo.clearbit.com/usbank.com' },
  { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },

  // Europe
  { name: 'Barclays', logo: 'https://logo.clearbit.com/barclays.com' },
  { name: 'BBVA', logo: 'https://logo.clearbit.com/bbva.com' },
  { name: 'BNP Paribas', logo: 'https://logo.clearbit.com/bnpparibas.com' },
  { name: 'Commerzbank', logo: 'https://logo.clearbit.com/commerzbank.com' },
  { name: 'Crédit Agricole', logo: 'https://logo.clearbit.com/credit-agricole.com' },
  { name: 'Credit Suisse', logo: 'https://logo.clearbit.com/credit-suisse.com' },
  { name: 'Danske Bank', logo: 'https://logo.clearbit.com/danskebank.com' },
  { name: 'Deutsche Bank', logo: 'https://logo.clearbit.com/db.com' },
  { name: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com' },
  { name: 'ING Group', logo: 'https://logo.clearbit.com/ing.com' },
  { name: 'Lloyds Banking Group', logo: 'https://logo.clearbit.com/lloydsbankinggroup.com' },
  { name: 'NatWest Group', logo: 'https://logo.clearbit.com/natwestgroup.com' },
  { name: 'Nordea', logo: 'https://logo.clearbit.com/nordea.com' },
  { name: 'Santander Group', logo: 'https://logo.clearbit.com/santander.com' },
  { name: 'Société Générale', logo: 'https://logo.clearbit.com/societegenerale.com' },
  { name: 'Standard Chartered', logo: 'https://logo.clearbit.com/sc.com' },
  { name: 'UBS', logo: 'https://logo.clearbit.com/ubs.com' },
  { name: 'UniCredit', logo: 'https://logo.clearbit.com/unicreditgroup.eu' },

  // Asia
  { name: 'Agricultural Bank of China', logo: 'https://logo.clearbit.com/abchina.com' },
  { name: 'Axis Bank', logo: 'https://logo.clearbit.com/axisbank.com' },
  { name: 'Bandhan Bank', logo: 'https://logo.clearbit.com/bandhanbank.com' },
  { name: 'Bank of Baroda', logo: 'https://logo.clearbit.com/bankofbaroda.in' },
  { name: 'Bank of China', logo: 'https://logo.clearbit.com/boc.cn' },
  { name: 'Bank of India', logo: 'https://logo.clearbit.com/bankofindia.co.in' },
  { name: 'Bank of Maharashtra', logo: 'https://logo.clearbit.com/bankofmaharashtra.in' },
  { name: 'Canara Bank', logo: 'https://logo.clearbit.com/canarabank.com' },
  { name: 'Central Bank of India', logo: 'https://logo.clearbit.com/centralbankofindia.co.in' },
  { name: 'China Construction Bank', logo: 'https://logo.clearbit.com/ccb.com' },
  { name: 'DBS Bank', logo: 'https://logo.clearbit.com/dbs.com' },
  { name: 'Federal Bank', logo: 'https://logo.clearbit.com/federalbank.co.in' },
  { name: 'HDFC Bank', logo: 'https://logo.clearbit.com/hdfcbank.com' },
  { name: 'ICBC', logo: 'https://logo.clearbit.com/icbc.com.cn' },
  { name: 'ICICI Bank', logo: 'https://logo.clearbit.com/icicibank.com' },
  { name: 'IDBI Bank', logo: 'https://logo.clearbit.com/idbibank.in' },
  { name: 'IDFC First Bank', logo: 'https://logo.clearbit.com/idfcfirstbank.com' },
  { name: 'Indian Bank', logo: 'https://logo.clearbit.com/indianbank.in' },
  { name: 'IndusInd Bank', logo: 'https://logo.clearbit.com/indusind.com' },
  { name: 'Karur Vysya Bank', logo: 'https://logo.clearbit.com/kvb.co.in' },
  { name: 'Kotak Mahindra Bank', logo: 'https://logo.clearbit.com/kotak.com' },
  { name: 'Mitsubishi UFJ Financial Group', logo: 'https://logo.clearbit.com/mufg.jp' },
  { name: 'OCBC Bank', logo: 'https://logo.clearbit.com/ocbc.com' },
  { name: 'Punjab & Sind Bank', logo: 'https://logo.clearbit.com/punjabandsindbank.co.in' },
  { name: 'Punjab National Bank', logo: 'https://logo.clearbit.com/pnbindia.in' },
  { name: 'RBL Bank', logo: 'https://logo.clearbit.com/rblbank.com' },
  { name: 'South Indian Bank', logo: 'https://logo.clearbit.com/southindianbank.com' },
  { name: 'State Bank of India', logo: 'https://logo.clearbit.com/sbi.co.in' },
  { name: 'UCO Bank', logo: 'https://logo.clearbit.com/ucobank.com' },
  { name: 'Union Bank of India', logo: 'https://logo.clearbit.com/unionbankofindia.co.in' },
  { name: 'United Overseas Bank (UOB)', logo: 'https://logo.clearbit.com/uobgroup.com' },
  { name: 'Yes Bank', logo: 'https://logo.clearbit.com/yesbank.in' },
  
  // Australia
  { name: 'ANZ', logo: 'https://logo.clearbit.com/anz.com' },
  { name: 'Commonwealth Bank', logo: 'https://logo.clearbit.com/commbank.com.au' },
  { name: 'National Australia Bank (NAB)', logo: 'https://logo.clearbit.com/nab.com.au' },
  { name: 'Westpac', logo: 'https://logo.clearbit.com/westpac.com.au' },
];

export const getBankLogo = (bankName: string): string | undefined => {
    if (!bankName) return undefined;
    const bank = popularBanks.find(b => b.name.toLowerCase() === bankName.toLowerCase());
    return bank?.logo;
}
