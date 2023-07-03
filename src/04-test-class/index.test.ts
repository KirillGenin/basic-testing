import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const INIT_BALANCE = 1000;
  const DEPOSIT = 200;
  const WITHDRAW = 100;
  const TRANSFER = 300;

  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    expect(bankAccount.getBalance()).toBe(INIT_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    expect(() => bankAccount.withdraw(INIT_BALANCE + WITHDRAW)).toThrow(
      new InsufficientFundsError(INIT_BALANCE),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    const bankAccountTarget = getBankAccount(0);
    expect(() =>
      bankAccount.transfer(INIT_BALANCE + TRANSFER, bankAccountTarget),
    ).toThrow(new InsufficientFundsError(INIT_BALANCE));
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    expect(() => bankAccount.transfer(TRANSFER, bankAccount)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    bankAccount.deposit(DEPOSIT);
    expect(bankAccount.getBalance()).toBe(INIT_BALANCE + DEPOSIT);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    bankAccount.withdraw(WITHDRAW);
    expect(bankAccount.getBalance()).toBe(INIT_BALANCE - WITHDRAW);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    const bankAccountTarget = getBankAccount(INIT_BALANCE);
    bankAccount.transfer(TRANSFER, bankAccountTarget);
    expect(bankAccount.getBalance()).toBe(INIT_BALANCE - TRANSFER);
    expect(bankAccountTarget.getBalance()).toBe(INIT_BALANCE + TRANSFER);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(15);
    const balance = await bankAccount.fetchBalance();
    expect(balance).toBe(15);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(250);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toEqual(250);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(INIT_BALANCE);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
