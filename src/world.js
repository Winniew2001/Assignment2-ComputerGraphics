class World{
    objects = [];

    add(object){
        this.objects.push(object)
    }

    worldHit(ray, t_min, t_max){
        let t_rec = new HitRecord()
        let closest = t_max;

        for (let i = 0; i < this.objects.length; i++){
            let object = this.objects[i].hit(ray, t_min, closest);
            if (object.hit){
                closest = object.t;
                t_rec = object;
            }
        }
        return t_rec;
    }
}