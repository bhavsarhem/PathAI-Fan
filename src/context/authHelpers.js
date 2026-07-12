import { DEMO_FANS, DEMO_STAFF } from '../data/mock_data';

// ─── Helper: login as demo fan ────────────────────────────────────────────────
export function loginAsFan(dispatch, mobile) {
  const fan = DEMO_FANS.find(f => f.mobile === mobile) || {
    fan_id: `FAN_${Date.now()}`,
    name: 'Demo Fan',
    mobile,
    vehicle_number: null,
    language: 'en',
    tickets: [],
    linked_companions: []
  };
  dispatch({ type: 'LOGIN', payload: { user: fan, role: 'fan' } });
}

export function loginAsStaff(dispatch, mobile) {
  const staff = DEMO_STAFF.find(s => s.mobile === mobile) || DEMO_STAFF[0];
  dispatch({ type: 'LOGIN', payload: { user: staff, role: staff.role } });
}

// ─── Helper: password verification ────────────────────────────────────────────
export function checkPassword(mobile, password) {
  const stored = localStorage.getItem('pathai_user_passwords');
  let passwords = {};
  if (stored) {
    try {
      passwords = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  const correctPassword = passwords[mobile] || 'Test@123';
  return password === correctPassword;
}

export function updatePassword(mobile, currentPassword, newPassword) {
  if (!checkPassword(mobile, currentPassword)) {
    return { success: false, message: 'Current password is incorrect' };
  }
  const stored = localStorage.getItem('pathai_user_passwords') || '{}';
  let passwords = {};
  try {
    passwords = JSON.parse(stored);
  } catch (e) {
    console.error(e);
  }
  passwords[mobile] = newPassword;
  localStorage.setItem('pathai_user_passwords', JSON.stringify(passwords));
  return { success: true };
}
