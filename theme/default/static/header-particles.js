Particles.init({
    selector: '.header-background',
    color: '#ffffff',
    maxParticles: 70,
    sizeVariations: 4,
    connectParticles: true,
    minDistance: 40,
    responsive: [
        {
            breakpoint: 720,
            options: {
                maxParticles: 40
            }
        }, {
            breakpoint: 400,
            options: {
                maxParticles: 20
            }
        }
    ]
});