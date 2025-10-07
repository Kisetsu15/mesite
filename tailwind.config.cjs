module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'bg-dark': '#050509',
                'snow': '#f7fafc',   
                'muted': '#9aa1a8',
                'panel': '#0b0b0d' 
            },
            boxShadow: {
                'soft': '0 6px 20px rgba(0,0,0,0.6)',
                'glow': '0 6px 30px rgba(255,255,255,0.02)'
            },
            borderRadius: {
                xl: '14px'
            }
        }
    },
    plugins: []
}
