import random
import string


def random_string(length=20):
    choices = string.ascii_letters + string.digits + string.punctuation
    pw = ''.join([random.choice(choices) for x in range(length)])
    return pw
