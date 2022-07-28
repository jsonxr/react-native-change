export type Pattern = {
  matcher: string | RegExp;
  replace: string;
  condition?: boolean;
};

export type PatternCommand = {
  paths: string[];
  patterns: Pattern[];
};

export const filterPatterns = (patterns: Pattern[]) =>
  patterns.filter(p =>
    typeof p.condition === 'undefined' ? p.matcher !== p.replace : p.condition
  );
