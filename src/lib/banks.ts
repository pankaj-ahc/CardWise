export interface BankInfo {
  name: string;
  logo: string;
}

export const popularBanks: BankInfo[] = [
  { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
  { name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com' },
  { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com' },
  { name: 'Citibank', logo: 'https://logo.clearbit.com/citi.com' },
  { name: 'Discover', logo: 'https://logo.clearbit.com/discover.com' },
  { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
  { name: 'U.S. Bank', logo: 'https://logo.clearbit.com/usbank.com' },
  { name: 'Barclays', logo: 'https://logo.clearbit.com/barclays.com' },
  { name: 'PNC Bank', logo: 'https://logo.clearbit.com/pnc.com' },
  { name: 'TD Bank', logo: 'https://logo.clearbit.com/td.com' },
];

export const getBankLogo = (bankName: string): string | undefined => {
    if (!bankName) return undefined;
    const bank = popularBanks.find(b => b.name.toLowerCase() === bankName.toLowerCase());
    return bank?.logo;
}
