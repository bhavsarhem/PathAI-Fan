import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkPassword, updatePassword } from './authHelpers';

describe('AppContext Auth Helpers', () => {
  beforeEach(() => {
    // Clear localStorage mockup before each test
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('checkPassword should return true for default password when none is stored', () => {
    localStorage.getItem.mockReturnValue(null);
    const result = checkPassword('9876543210', 'Test@123');
    expect(result).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('pathai_user_passwords');
  });

  it('checkPassword should return false for incorrect password', () => {
    localStorage.getItem.mockReturnValue(null);
    const result = checkPassword('9876543210', 'WrongPassword');
    expect(result).toBe(false);
  });

  it('updatePassword should fail if current password is wrong', () => {
    localStorage.getItem.mockReturnValue(null);
    const result = updatePassword('9876543210', 'WrongPass', 'NewPass123');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Current password is incorrect');
  });

  it('updatePassword should succeed with correct current password and store new one', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ '9876543210': 'OldPass' }));
    const result = updatePassword('9876543210', 'OldPass', 'NewPass123');
    
    expect(result.success).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pathai_user_passwords',
      expect.stringContaining('NewPass123')
    );
  });
});
