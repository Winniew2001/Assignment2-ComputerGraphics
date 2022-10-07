class World{
    objects = [];

    add(object){
        this.objects.push(object)
    }

    worldHit(ray, tMin, tMax){
        let tempRecord = new HitRecord()
        let closest = tMax;

        for (let i = 0; i < this.objects.length; i++){
            let object = this.objects[i].hit(ray, tMin, closest);
            if (object.hit){
                closest = object.t;
                tempRecord = object;
            }
        }
        return tempRecord;
    }
}