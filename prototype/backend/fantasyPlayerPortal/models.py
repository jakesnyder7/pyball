from django.db import models

# Create your models here.

## This is for testing purposes - not sure how helpful this model really is

class NFLPlayer(models.Model):
    name = models.CharField(max_length=120)
    position = models.CharField(max_length=5)
    number = models.IntegerField()

    def _str_(self):
        toString = str(self.title) + " #" + str(self.number)
        return toString
