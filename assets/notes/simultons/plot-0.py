from maxwellbloch import mb_solve
import numpy as np

SECH_FWHM_CONV = 1./2.6339157938
t_width = 1.0*SECH_FWHM_CONV # [τ]
print('t_width', t_width)

n = np.sqrt(2) # For a pulse area of nπ    
ampl = n/t_width/(2*np.pi) # Pulse amplitude [2π Γ]
print('ampl', ampl)

mb_solve_json = """
{
  "atom": {
    "fields": [
      {
        "coupled_levels": [[0, 1]],
        "rabi_freq": %f,
        "rabi_freq_t_args": 
          {
             "ampl": 1.0,
             "centre": 0.0,
             "width": %f
          },
        "rabi_freq_t_func": "sech"
      },
      {
        "coupled_levels": [[0, 2]],
        "rabi_freq": %f,
        "rabi_freq_t_args": 
          {
             "ampl": 1.0,
             "centre": 0.0,
             "width": %f
          },
        "rabi_freq_t_func": "sech"
      }
    ],
    "num_states": 3
  },
  "t_min": -2.0,
  "t_max": 10.0,
  "t_steps": 120,
  "z_min": -0.2,
  "z_max": 1.2,
  "z_steps": 70,
  "interaction_strengths": [10.0, 10.0]
}
"""%(ampl, t_width, ampl, t_width)

mbs = mb_solve.MBSolve().from_json_str(mb_solve_json)
Omegas_zt, states_zt = mbs.mbsolve(recalc=False)

# PLOT ------------------------------------------------------------------------

import matplotlib.pyplot as plt
import seaborn as sns
sns.set_style('darkgrid')

fig = plt.figure(1, figsize=(12, 8))

# Probe 
ax = fig.add_subplot(211)
cmap_range = np.linspace(0.0, 0.8, 11)
cf = ax.contourf(mbs.tlist, mbs.zlist, 
                 np.abs(mbs.Omegas_zt[0]/(2*np.pi)), 
                 cmap_range, cmap=plt.cm.Blues)
ax.set_title('Rabi Frequency ($\Gamma / 2\pi $)')
ax.set_ylabel('Distance ($L$)')
ax.text(0.02, 0.95, 'Probe',
        verticalalignment='top', horizontalalignment='left',
        transform=ax.transAxes, color='grey', fontsize=16)
plt.colorbar(cf)

# Coupling
ax = fig.add_subplot(212)
cmap_range = np.linspace(0.0, 0.8, 11)
cf = ax.contourf(mbs.tlist, mbs.zlist, 
                 np.abs(mbs.Omegas_zt[1]/(2*np.pi)), 
                 cmap_range, cmap=plt.cm.Greens)
ax.set_xlabel('Time ($1/\Gamma$)')
ax.set_ylabel('Distance ($L$)')
ax.text(0.02, 0.95, 'Coupling',
        verticalalignment='top', horizontalalignment='left',
        transform=ax.transAxes, color='grey', fontsize=16)
plt.colorbar(cf)

# Both
for ax in fig.axes:
    for y in [0.0, 1.0]:
        ax.axhline(y, c='grey', lw=1.0, ls='dotted')
plt.tight_layout()

plt.savefig('plot-0.png')
plt.show()
