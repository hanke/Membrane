DEMOPATH = demo
BUILDPATH = build

all: demo

$(BUILDPATH)/t1w.nii.gz:
	mkdir -p $(BUILDPATH)
	wget -O $@ http://psydata.ovgu.de/forrest_gump/sub012/anatomy/highres001.nii.gz

mkdir-%:
	@mkdir -p $*

demo: mkdir-$(DEMOPATH) $(DEMOPATH)/0.webm $(DEMOPATH)/1.webm $(DEMOPATH)/2.webm

$(DEMOPATH)/%.webm: $(BUILDPATH)/t1w.nii.gz
	./nii2mov $(BUILDPATH)/t1w.nii.gz $@ $*

