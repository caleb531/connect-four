import { expect } from '@playwright/test';

export default function globalSetup() {
  global.expect = expect;
}
