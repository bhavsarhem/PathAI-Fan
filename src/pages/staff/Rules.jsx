import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';

const CATEGORIES = ['Safety', 'Security', 'Operations', 'Emergency', 'General'];
const CAT_COLORS = { Safety: '#38A169', Security: '#DD6B20', Operations: '#2B6CB0', Emergency: '#E53E3E', General: '#553C9A' };

export default function Rules() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const isOrganizer = state.userRole === 'organizer';
  const [editId, setEditId] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', category: 'General' });

  const handleSave = () => {
    if (!draft.title || !draft.content) return;
    const newRules = editId
      ? state.rules.map(r => r.id === editId ? { ...r, ...draft } : r)
      : [...state.rules, { id: `R${Date.now()}`, ...draft }];
    dispatch({ type: 'UPDATE_RULES', payload: newRules });
    setEditId(null);
    setAddMode(false);
    setDraft({ title: '', content: '', category: 'General' });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'UPDATE_RULES', payload: state.rules.filter(r => r.id !== id) });
  };

  const handleEdit = (rule) => {
    setDraft({ title: rule.title, content: rule.content, category: rule.category });
    setEditId(rule.id);
    setAddMode(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => navigate('/staff')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem' }}>📋</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Rules & Regulations</h1>
          </div>
          {isOrganizer && !addMode && (
            <button onClick={() => setAddMode(true)} className="btn-gold" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Rule
            </button>
          )}
        </div>

        {/* Add / Edit Form */}
        <AnimatePresence>
          {addMode && isOrganizer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card" style={{ padding: '24px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129,0.25)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#10B981' }}>{editId ? 'Edit Rule' : 'New Rule'}</h2>
                <button onClick={() => { setAddMode(false); setEditId(null); setDraft({ title: '', content: '', category: 'General' }); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Rule title" className="input-field w-full" style={{ padding: '12px 16px' }} />
                <textarea value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))} placeholder="Rule content..." className="input-field w-full" rows={3} style={{ padding: '12px 16px', resize: 'none' }} />
                <select value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} className="input-field w-full" style={{ padding: '12px 16px' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleSave} className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={15} /> Save
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rules list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {state.rules.map(rule => {
            const color = CAT_COLORS[rule.category] || '#555';
            return (
              <motion.div key={rule.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card" style={{ padding: '20px 24px', borderLeft: `3px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{rule.title}</h2>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color, background: `${color}15`, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>{rule.category}</span>
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{rule.content}</p>
                  </div>
                  {isOrganizer && (
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => handleEdit(rule)} style={{ background: 'rgba(16, 185, 129,0.1)', border: '1px solid rgba(16, 185, 129,0.2)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#10B981' }}><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(rule.id)} style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#FC8181' }}><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
